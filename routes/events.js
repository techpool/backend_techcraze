var async = require('async');

module.exports = function (app) {
	app.post('/events', function(req, res) {
		var body = req.body;
		var jsonToSend = [];
		if (body.partners) {
			// If partners are present for the user
			// iterate over them to find whether they are already registered or not
			var partners = body.partners;
			console.log(body);

			// First check whether the applied person is already registered with the same event or not
			Events.findOne({
				$and: [{
					name: body.name
				},{
					emailId: body.emailId
				}]
			}).exec(function (err, student) {
				if (student) {

					// The student is already registered so canel the whole stuff
					// and send a failure message
					res.json({
						status: 'failed',
						addInfo: 'Already registered in this event'
					})
				} else {

					// Else he is a new participant forthe event
					// Get him registered
					var parentEvent = new Events({
						emailId: body.emailId,
						name: body.name,
						partners: partners,
						paid: false
					});

					// Save the participant in DB
					parentEvent.save(function(err, savedParentObj) {
						if (err) {
							console.log(err);
						} else {
							// The primary person who was registering has been registered successfully

							// Iterating over the partners
							async.eachSeries(partners, function(partner, iteratenext) {

								// Check whether the student is already there in student DB
								Student.findOne({
									email: partner
								}, function(err, student) {
									if (err) {
										console.log(err);
									} else {

										// If already present then create the event document for him/her
										if (student) {

											// Before creating event doc check whether the partner is registered with the same event or not
											Events.findOne({
												$and: [{
													name: body.name
												},{
													emailId: student.emailId
												}]
											}).exec(function (err, duplicateStudent) {

												// If the partner is already presnt then store it in a JSON
												if (duplicateStudent) {
													var user = {
														status: 'failed',
														details: partner
													}
													jsonToSend.push(user);
												} else {


													// If the student is already registered
													// Create an event table for him as well

													// TODO: Send an automated mail invitation to him/her
													var tempPartners = partners;
													var index = tempPartners.indexOf(student.emailId);

													if (index > -1) {
													    tempPartners.splice(index, 1);
													}
													var event = new Events({
														emailId: partner,
														name: body.name,
														partners: tempPartners,
														paid: false
													});

													event.save(function(err, savedObj) {
														if (err) {
															console.log(err);
														} else {
															// Saved successfully
															// Go to the next partner
															var user = {
																status: 'success',
																details: partner
															}
															jsonToSend.push(user);

															iteratenext(null);
														}
													});
												}
											})

										} else {
											// TODO: Send an invitation mail to the partner for registration

											var pendingUser = new Pending({
												emailId: partner,
												partnerEventId: savedParentObj._id
											});

											pendingUser.save(function(err, savedObj) {
												if (err) {
													console.log(err)
												} else {
													// Partner Saved in Pending User's list
													// Move over to the next user

													var user = {
														status: 'pending',
														details: partner
													}
													jsonToSend.push(user);


													iteratenext(null);
												}
											});

										}
									}
								})
							}, function(err) {
								if (err) {
									console.log(err);
								} else {
									// All partners has been invited or added to the list of events
									res.json({
										status: 'success',
										addInfo: 'All partners has been registered along with the user'
									});
								}
							})
						}
					})
				}
			})
		} else {
			
			// In case there are no partners just save the current user

			var parentEvent = new Events({
				name: body.name,
				emailId: body.emailId,
				partners: null,
				paid: false
			});

			parentEvent.save(function(err, savedParentObj) {
				if (err) {
					console.log(err);
				} else {
					// User has been registered successfully for the event

					res.json({
						status: 'success',
						addInfo: 'User has been registered successfully'
					});
				}
			})

		}
	});
}