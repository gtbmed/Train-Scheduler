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

    //Calculated Values
    var nextArrival = 0;
    var minutesAway = 0;

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

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("HHmm"));

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
            nextArrival: nextArrival,
            minutesAway: minutesAway
        });
        //Clear fields in "Add Train"
        $("#train-name").val("");
        $("#destination").val("");
        $("#start-time").val("");
        $("#train-frequency").val("");
    });

});
