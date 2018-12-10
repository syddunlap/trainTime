$(document).ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBha_FginXLjnFYlKfsnVcwMRBVhZ1oqOk",
        authDomain: "trainscheduler-378ed.firebaseapp.com",
        databaseURL: "https://trainscheduler-378ed.firebaseio.com",
        projectId: "trainscheduler-378ed",
        storageBucket: "trainscheduler-378ed.appspot.com",
        messagingSenderId: "960480193535"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    // Button for adding trains
    $("#submit").on("click", function (event) {
        event.preventDefault();

        // Grab user input
        var trainName = $("#trainName").val().trim();
        var destination = $("#destination").val().trim();
        var firstTrain = parseInt($("#firstTrain").val().trim());
        var frequency = $("#frequency").val().trim();

        // Create object for holding new train
        var newTrain = {
            trainName: trainName,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency
        };

        // Upload to database
        database.ref().push(newTrain);

        // Log to console
        console.log(newTrain.trainName);
        console.log(newTrain.destination);
        console.log(newTrain.firstTrain);
        console.log(newTrain.frequency);

        // Clear the text boxes
        $("#trainName").val("");
        $("#destination").val("");
        $("#firstTrain").val("");
        $("frequency").val("");
    });

    // Firebase event for adding train to database and a new row in HTML when user hits submit
    database.ref().on("child_added", function (childSnapshot) {
        console.log(childSnapshot.val());

        // Store everything in variables
        var trainName = childSnapshot.val().trainName;
        var destination = childSnapshot.val().destination;
        var firstTrain = childSnapshot.val().firstTrain;
        var frequency = childSnapshot.val().frequency;

        // Math to get Next Train & Minutes until next train
        var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);
        var currentTime = moment();
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        var tRemainder = diffTime % frequency
        var minutesTilTrain = frequency - tRemainder;
        var nextTrain = moment().add(minutesTilTrain, "minutes").format("HH:mm");

        // Add row to table
        var addedTrain = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(destination),
            $("<td>").text(frequency),
            $("<td>").text(nextTrain),
            $("<td>").text(minutesTilTrain)        
        );

        // Append row to HTML
        $(".table > tbody").append(addedTrain);
    });
})