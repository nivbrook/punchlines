
export function formatDate(dateString) {
    const date = new Date(dateString);

    const monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
  
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
  
    return monthNames[monthIndex] + ' ' + year;
}
  
export function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug", 
    "Sep", "Oct", "Nov", "Dec"
  ];

  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  var hours = null;
  var AMorPM = null;

  if (date.getHours() === 0){
    hours = 12;
    AMorPM = "AM";
  } else if (date.getHours()<=12) {
    hours = date.getHours();
    if(hours!==12){
      AMorPM = "AM";
    } else {
      AMorPM = "PM";
    }
  } else {
    hours = date.getHours()-12;
    AMorPM = "PM"
  }
  var minutes = date.getMinutes();
  if (minutes===0){
    minutes = "00"
  } else if (minutes<10){
    minutes = "0"+minutes;
  }
  return monthNames[monthIndex] + ' ' + date.getDate() + ' ' +  year + ' - ' + hours + ':' + minutes + " " + AMorPM;
}  