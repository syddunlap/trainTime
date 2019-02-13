$(document).ready(function () {

    // Initialize Firebase
    const config = {
        apiKey: "AIzaSyBha_FginXLjnFYlKfsnVcwMRBVhZ1oqOk",
        authDomain: "trainscheduler-378ed.firebaseapp.com",
        databaseURL: "https://trainscheduler-378ed.firebaseio.com",
        projectId: "trainscheduler-378ed",
        storageBucket: "trainscheduler-378ed.appspot.com",
        messagingSenderId: "960480193535"
    };
    firebase.initializeApp(config);

    const database = firebase.database();

    // Button for adding trains
    $("#submit").on("click", function (event) {
        event.preventDefault();

        // Grab user input
        let trainName = $("#trainName").val().trim();
        let destination = $("#destination").val().trim();
        let firstTrain = parseInt($("#firstTrain").val().trim());
        let frequency = $("#frequency").val().trim();

        // Create object for holding new train
        let newTrain = {
            trainName: trainName,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency
        };

        // Upload to database
        database.ref().push(newTrain);

        // Clear the text boxes
        $("#trainName").val("");
        $("#destination").val("");
        $("#firstTrain").val("");
        $("frequency").val("");
    });

    // Firebase event for adding train to database and a new row in HTML when user hits submit
    database.ref().on("child_added", function (childSnapshot) {

        // Store everything in variables
        let trainName = childSnapshot.val().trainName;
        let destination = childSnapshot.val().destination;
        let firstTrain = childSnapshot.val().firstTrain;
        let frequency = childSnapshot.val().frequency;

        // Math to get Next Train & Minutes until next train
        let firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
        let currentTime = moment();
        let diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        let tRemainder = diffTime % frequency
        let minutesTilTrain = frequency - tRemainder;
        let nextTrain = moment().add(minutesTilTrain, "minutes").format("HH:mm");

        // Add row to table
        let addedTrain = $("<tr>").append(
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