$(document).ready(function() {
    // Initialize Firebase

    var config = {
        apiKey: "AIzaSyDdU5xvnUg7cuK2_KJMNBS9c0_3F0eF9Hg",
        authDomain: "trainstuff-3fc0d.firebaseapp.com",
        databaseURL: "https://trainstuff-3fc0d.firebaseio.com",
        projectId: "trainstuff-3fc0d",
        storageBucket: "trainstuff-3fc0d.appspot.com",
        messagingSenderId: "34548785661"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    //Global Variables
    var name = "";
    var destination = "";
    var startTime = 0;
    var frequency = 0;

    $("#add-Train").on("click", function(event) {
        event.preventDefault();

        name = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        startTime = $("#start-time").val().trim();
        frequency = $("#train-frequency").val().trim();
        console.log(name);
        console.log(destination);
        console.log(startTime);
        console.log(frequency);

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(startTime, "HHmm").subtract(1, "years");
        console.log(firstTimeConverted);


        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % frequency;
        console.log(tRemainder);

        // Minute Until Train
        minutesAway = frequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + minutesAway);

        // Next Train
        var nextTrain = moment().add(minutesAway, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("HHmm"));
        nextArrival = moment(nextTrain, "HHmm").format("HHmm");
        // Upload train data to the database
        database.ref().push({
            name: name,
            destination: destination,
            startTime: startTime,
            frequency: frequency,
        });
        //Clear fields in "Add Train"
        $("#train-name").val("");
        $("#destination").val("");
        $("#start-time").val("");
        $("#train-frequency").val("");
    });

database.ref().on("child_added", function(childSnapshot, prevChildKey) {
	console.log(childSnapshot.val());

	var recall_name = childSnapshot.val().name;
	var recall_destination = childSnapshot.val().destination;
	var recall_startTime = childSnapshot.val().startTime;
	var recall_frequency = childSnapshot.val().frequency;

	// Calculate Time of Next Train Arrival and minute until next train arrives
	// convert the Start time of the train to be used by momentJS as HHmm
	var firstTimeConverted = moment(recall_startTime, "HHmm").subtract(1, "years");
	// Find the difference in minutes between the start time and the current time
	var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	// Divide the difference by the frequency as the remainder is used in the next calculation
	var tRemainder = diffTime % recall_frequency;
	//The frequency each train arrives minus the remainder equals the amount of time till the next train
	var minutesAway = recall_frequency - tRemainder;
	// Add the minutes from arrival to the current time to give an arrival time
	var nextTrain = moment().add(minutesAway, "minutes");
	//Store the arrival time in a usable format
	var nextArrival = moment(nextTrain, "HHmm").format("h:mm A");
	// add an entry to the train table
	$("#trainTable > tbody").append("<tr><td>" + recall_name + "</td><td>" + recall_destination + "</td><td>" + recall_frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway  + "</td></tr>");

	} , function(errorObject) {
		console.log("Errors handled: " + errorObject.code);

});

});