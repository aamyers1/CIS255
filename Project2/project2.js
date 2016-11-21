//File:            project2.js
//Author:          Alissa Myers
//Class:           CIS 255
//
//Input:           (1)JSON object file for CS major 
//				   (2)JSON object file for CIS major
//				   (3)User input for courses taken
//Processing:      (1)Initialize global Variables
//				   (2)function to get courses from the user entered "courses taken" textarea on button click
//				   (3)function that imports a list of the CS, CIS, and MATH courses needed for the CS Major on button click
//				   (4)function that imports a list of the CS, CIS, and MATH courses needed for the CIS Major on button click
//				   (5)Function that shows the Needed courses for the major minus the user entered taken courses in the needed courses textbox
//				   (6)xmlhttp request 1 - for CS courses
//				   (7)xmlhttp request 2 - for CIS courses
//				   (8)xmlhttp request 3 - for MATH courses
//				   (9)function on button click that adds all 3 imported objects into one array on click
//				   (10)function that prints all courses from the SVSU api that match the courses needed list and prints them to the available courses Also prints the unavailable courses
//Output:			(1)List of needed classes
//					(2)List of Available classes
//					(3)List of Unavailable classes
		
	//Initialize global Variables
	var arr2 = [];
	var coursesTaken = [];
	var coursesNeeded =[];
	var finalCoursesNeeded= [];
	var outNeeded = document.getElementById("out1");
	var k = 0;
	var myArr = [];
	var myArr2 = [];
	
	//function to get courses from the user entered "courses taken" textarea
	function getTaken() {
	
		//clear array
		coursesTaken =[];
		
		//get values from textarea
		var Str = document.getElementById("takenInput").value;
		
		//split the string using comma as a delimeter
		var out = Str.split(",");
		
		//put the resulting values into an array, coursesTaken
		for(var i=0; i<out.length; i++){
			coursesTaken[i]=out[i].trim();
		}
	}
	
	//function that imports a list of the CS, CIS, and MATH courses needed for the CS Major on button click
	function CSList() {
		for(var i=0;i<CSCourses.length;i++){
			coursesNeeded[i] = CSCourses[i].prefix + " " + CSCourses[i].courseNumber;
		}
	}
	
	//function that imports a list of the CS, CIS, and MATH courses needed for the CIS Major on button click
	function CISList() {
		for(var i=0;i<CISCourses.length;i++) {
			coursesNeeded[i] = CISCourses[i].prefix + " " + CISCourses[i].courseNumber;
		}
	}
	
	//Function that shows the Needed courses for the major minus the user entered taken courses in the needed courses textbox
	function showNeeded() {
		//if courses entered by user and courses listed in the major are the same, make the value null
		for(var i =0; i< coursesNeeded.length; i++){
			for(var j =0; j<coursesTaken.length;j++) {
				if(coursesNeeded[i]==coursesTaken[j]) {
					coursesNeeded[i]=null;
				}
			}
		}
		
		//create a seperate array to hold the final needed values
		var k = 0;
		for(var i = 0; i<coursesNeeded.length;i++) {
			if(coursesNeeded[i]!=null){
				finalCoursesNeeded[k]=coursesNeeded[i];
				k++;
			}
		}
		
		
		var list = "";
		//output the array values to the textarea for Courses Needed
		for(var i = 0; i<finalCoursesNeeded.length;i++){
			list+=finalCoursesNeeded[i] + "\n"
		}
		outNeeded.value=list; 
	}

	//xmlhttp request one- for CS courses
	var xmlhttp = new XMLHttpRequest();
	var url = "https://api.svsu.edu/courses?prefix=CS&term=17/WI";
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			myArr = JSON.parse(xmlhttp.responseText);
		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
	
	//xmlhttp request2 - for CIS courses
	var xmlhttp2 = new XMLHttpRequest();
	var url2 = "https://api.svsu.edu/courses?prefix=CIS&term=17/WI";
	
	
	xmlhttp2.onreadystatechange = function() {
		if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200) {
			myArr2 = JSON.parse(xmlhttp2.responseText);	
		}
	};
	
	xmlhttp2.open("GET", url2, true);
	xmlhttp2.send();
	
	
	//xmlhttp request 3 - for Math courses
	var xmlhttp3 = new XMLHttpRequest();
	var url3 = "https://api.svsu.edu/courses?prefix=MATH&term=17/WI";
	
	
	xmlhttp3.onreadystatechange = function() {
		if (xmlhttp3.readyState == 4 && xmlhttp3.status == 200) {
			myArr3 = JSON.parse(xmlhttp3.responseText);	
		}
	};
	
	xmlhttp3.open("GET", url3, true);
	xmlhttp3.send();
	
	
	//function on button click that adds all 3 imported objects into one array
	goodStuff = function() {
	var x = myArr.courses.length;
		for(var i = 0; i < myArr2.courses.length; i++){
			myArr.courses[x + i] = myArr2.courses[i];
		}
	var	x= myArr.courses.length;
		for(var i = 0; i < myArr3.courses.length; i++) {
			myArr.courses[x + i] = myArr3.courses[i];
			
		}
		//sends the final compiled array to funciton availCourses
		availCourses(myArr);
	}
	var out = "";
	k = 0;
	//function that prints all courses from the SVSU api that match the courses needed list and prints them to the available courses
	//Also prints the unavailable courses
	function availCourses(arr) {
	
		//for each object in the passed array, create a String with the prefix and course number
		for(var i = 0; i < arr.courses.length; i++) {
			for(var j=0;j<finalCoursesNeeded.length;j++) {
			var newText = arr.courses[i].prefix + " " 
				+ arr.courses[i].courseNumber ;	

			//if the resulting string equals a value in the needed courses array, add it to the 'out' string
			if(finalCoursesNeeded[j] == newText) {
				out+= arr.courses[i].prefix + " " 
				+ arr.courses[i].courseNumber  + " "
				+ arr.courses[i].term + " " 
				+ arr.courses[i].meetingTimes[0].days + " " 
				+ arr.courses[i].meetingTimes[0].startTime + " " 
				+ arr.courses[i].meetingTimes[0].instructor + "\n";
			}
			
			//if the string never equals a value in the finalCoursesNeeded array, put it in a seperate array for unavailable classes
			else if(finalCoursesNeeded.indexOf(newText)== -1){
				if(arr2.indexOf(newText) == -1){
				arr2[k] = newText;
				k++;
				}	
			}	
		}
	}
	
	//if arr2 values equal a finalCoursesNeeded value, set the FinalCoursesNeededat i to null
	for(var i = 0; i < arr2.length;i++) {
		for(var j = 0; j < finalCoursesNeeded.length; j++) {
			if(arr2[i]==finalCoursesNeeded[j]){
				finalCoursesNeeded[j]= null ;
			}
		}
	}
	
	//output the finalCoursesNeeded array to the out2 String
	var out2 = "";
	for(var i = 0; i < finalCoursesNeeded.length;i++) {
		if(finalCoursesNeeded[i] != null) {
			out2 +=  finalCoursesNeeded[i] + "\n";
		}
	}
	
	//put the values of out and out2 into the appropriate textAreas
	document.getElementById("out2").value = out; 
	document.getElementById("out3").value = out2; 
	}
