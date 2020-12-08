const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || 3000, function () {
	console.log("Node Server listening on port 3000");
	console.log(process.env.URL);
	console.log(process.env.API_KEY);
});

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const email = req.body.email;

	const userData = {
		members: [
			{
				email_address: email,

				status: "subscribed",

				merge_fields: {
					FNAME: firstName,

					LNAME: lastName,
				},
			},
		],
	};

	const jsonData = JSON.stringify(userData);

	const url = process.env.URL;

	const options = {
		method: "POST",
		auth: process.env.API_KEY,
	};

	const httpRequest = https.request(url, options, function (response) {
		if (response.statusCode === 200)
			res.sendFile(__dirname + "/success.html");
		else res.sendFile(__dirname + "/failure.html");
		response.on("data", function (data) {
			console.log(JSON.parse(data));
		});
		response.on("error", function (error) {
			console.log(error);
		});
	});

	httpRequest.write(jsonData);

	httpRequest.end();
});

app.post("/failure", function (req, res) {
	res.redirect("/");
});
