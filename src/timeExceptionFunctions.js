// timeExceptionFunctions.js

// Define addTimeException function
export function addTimeException() {
  var reason = document.getElementById('exceptionReason').value;
  if (reason) {
    saveTimeException(reason); // Assumes saveTimeException is defined elsewhere
    updateUI();
    document.getElementById('exceptionReason').value = '';
    document.getElementById('timeExceptionForm').style.display = 'none';
  } else {
    alert('Please enter a reason for the time exception.');
  }
}

export function updateDetails(user, manager) {
  var detailsPanel = document.getElementById('detailsPanel');
  var content = `<p>${user.firstName} ${user.lastName}</p>`;
  content += `<p> Reporting to: ${manager.firstName} ${manager.email}</p>`;
  detailsPanel.innerHTML = content;
}

// Define updateUI function
export function updateUI() {
  var timeExceptions = getTimeExceptions(); // Function from previous steps
  var listElement = document.getElementById('timeExceptionList');
  listElement.innerHTML = ''; // Clear existing items
  timeExceptions.forEach(function (exception) {
    var date = new Date(exception.timestamp); // Convert the timestamp to a Date object
    var dateString = date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }); // Convert the Date object to a readable string without seconds

    var listItem = document.createElement('li');
    listItem.textContent = `${dateString} - ${exception.reason}`; // Use the readable date string without seconds
    listElement.appendChild(listItem);
  });
}

export function generateMailtoLink() {
  // Retrieve user and line manager details
  const { userDetails, lineManagerDetails } = getUserDetails();

  // Retrieve the time exceptions
  const timeExceptions = getTimeExceptions(); // Assuming this function returns your list of exceptions

  // Construct the email body
  var emailBody = `Hi ${lineManagerDetails.firstName},\n\n`; // Greeting the line manager
  emailBody +=
    'Please See below for details of exceptions I have created punching in early, or out late, and the reasons for them:\n\n';

  // Append each time exception to the email body
  timeExceptions.forEach(function (exception) {
    var date = new Date(exception.timestamp);
    var dateString = date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    emailBody += `Date: ${dateString}, Reason: ${exception.reason}\n`; // Add time exception details
  });

  // Sign off with the user's name
  emailBody += `\nKind Regards,\n${userDetails.firstName} ${userDetails.lastName}`;

  // Encode the email body to make it URL-safe
  emailBody = encodeURIComponent(emailBody);

  // Construct the mailto link and set it on the email button
  var mailtoLink = document.getElementById('emailExceptionsBtn'); // The anchor element with id 'emailExceptionsBtn'
  mailtoLink.href = `mailto:${lineManagerDetails.email}?subject=Time Exceptions&body=${emailBody}`; // Set the href attribute with the line manager's email and the constructed email body
}

export function saveTimeException(reason) {
  var currentTime = new Date().toISOString(); // Get current time in ISO format
  var timeExceptions = JSON.parse(
    localStorage.getItem('timeExceptions') || '[]',
  ); // Get existing exceptions or initialize an empty array

  // Create a new time exception object
  var newException = {
    timestamp: currentTime,
    reason: reason,
  };

  // Add the new exception to the array
  timeExceptions.push(newException);

  // Save the updated array back to local storage
  localStorage.setItem('timeExceptions', JSON.stringify(timeExceptions));
}

export function getTimeExceptions() {
  // Retrieve the time exceptions from local storage and convert them from a JSON string to a JavaScript array
  var timeExceptions = JSON.parse(
    localStorage.getItem('timeExceptions') || '[]',
  );
  return timeExceptions;
}

export function downloadTimeExceptions() {
  // Retrieve the time exceptions from local storage or another source
  var timeExceptions = getTimeExceptions(); // Replace with actual retrieval method

  // Start CSV content with column headers
  var csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += 'Timestamp,Reason\n'; // Column headers

  // Add data rows for each time exception
  timeExceptions.forEach(function (exception) {
    var row = `"${exception.timestamp}","${exception.reason}"`; // Encapsulate fields in quotes to handle commas and line breaks within fields
    csvContent += row + '\n';
  });

  // Create a blob from the CSV content
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'time_exceptions.csv'); // Set the file name for the download
  document.body.appendChild(link); // Required for Firefox

  link.click(); // Trigger the download

  document.body.removeChild(link); // Clean up
}

export function saveUserDetails(details) {
  localStorage.setItem(
    'userDetails',
    JSON.stringify({
      firstName: details.firstName,
      lastName: details.lastName,
    }),
  );
  localStorage.setItem(
    'lineManagerDetails',
    JSON.stringify({
      firstName: details.managerFirstName,
      email: details.managerEmail,
    }),
  );
}

export function getUserDetails() {
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));
  const lineManagerDetails = JSON.parse(
    localStorage.getItem('lineManagerDetails'),
  );
  return { userDetails, lineManagerDetails };
}

export function saveDetailsAndDisplayContent() {
  // Object to hold user input values
  saveUserDetails({
    firstName: document.getElementById('userFirstName').value,
    lastName: document.getElementById('userLastName').value,
    managerFirstName: document.getElementById('managerFirstName').value,
    managerEmail: document.getElementById('managerEmail').value,
  });
  // Retrieve saved details to ensure the updated information is displayed
  const savedUserDetails = JSON.parse(localStorage.getItem('userDetails'));
  const savedLineManagerDetails = JSON.parse(
    localStorage.getItem('lineManagerDetails'),
  );

  // Update the details on the page with the retrieved, saved details
  updateDetails(savedUserDetails, savedLineManagerDetails); // Display user and manager details

  document.getElementById('detailsForm').style.display = 'none';
  document.getElementById('mainContent').style.display = 'block';
}
