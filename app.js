function weekController($scope){
	// Inital load with current date
	var curr = new Date();
	$scope.weekVm = {
		currentDate : formatDate(curr),
		firstDayOfWeek : formatDate(weekStart(curr)),
		lastDayOfWeek : formatDate(weekEnd(curr)),
		weekNo : getISOWeek(curr),
		calculatedWeekNo : getISOWeek(curr)
	};

	$scope.updateWeek =  function () {
		var weekNo = $scope.weekVm.weekNo;

		if(weekNo > 0 || weekNo <= 53){
			var firstDateOfWeek = firstDayOfWeek(weekNo);
			$scope.weekVm.firstDayOfWeek = formatDate(weekStart(firstDateOfWeek));
			$scope.weekVm.lastDayOfWeek = formatDate(weekEnd(firstDateOfWeek));
		}
	}

	$scope.updateDate = function () {
		var curr = parseDate($scope.weekVm.currentDate);
		if(isDate(curr)){
			$scope.weekVm.calculatedWeekNo = getISOWeek(curr);
		}
	}
}

function isDate (x) {
  return (null != x) && !isNaN(x) && ("undefined" !== typeof x.getDate); 
}

function getISOWeek(d)
{
    var firstDayOfYear = new Date(d.getFullYear(), 0, 1);
    var firstWeekDay = (6 + firstDayOfYear.getDay()) % 7;
    var dayNo = Math.floor((d - firstDayOfYear)/(24*60*60*1000));
    var weekNo = 1 + Math.floor((dayNo+firstWeekDay)/7);

    if(firstWeekDay >= 4)
        weekNo--;

    if(weekNo == 0)
        weekNo = getISOWeek(new Date(d.getFullYear()-1, 11, 31));

    return weekNo;
}

function weekStart (d) {
	return new Date(d.setDate(d.getDate() - d.getDay() + 1));
}

function weekEnd (d) {
	return new Date(d.setDate(d.getDate() - d.getDay()+7));
}

function formatDate(date) {
	var format = "YYYY-MM-DD";
    // Calculate date parts and replace instances in format string accordingly
    format = format.replace("DD", (date.getDate() < 10 ? '0' : '') + date.getDate()); // Pad with '0' if needed
    format = format.replace("MM", (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1)); // Months are zero-based
    format = format.replace("YYYY", date.getFullYear());
    return format;
}

function firstDayOfWeek(week) {
    var year 		= (new Date()).getFullYear();
    var date       	= firstWeekOfYear(year);
    var weekTime   	= weeksToMilliseconds(week);
    var targetTime 	= date.getTime() + weekTime;

    return new Date(date.setTime(targetTime));
}

function weeksToMilliseconds(weeks) {
    return 1000 * 60 * 60 * 24 * 7 * (weeks - 1);
}

function firstWeekOfYear(year) {
    var date = new Date();
    date = firstDayOfYear(date,year);
    date = firstWeekday(date);
    return date;
}

function firstDayOfYear(date, year) {
    date.setYear(year);
    date.setDate(1);
    date.setMonth(0);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}

function firstWeekday(firstOfJanuaryDate) {
	var FIRST_DAY_OF_WEEK = 1; // Monday, according to iso8601
	var WEEK_LENGTH = 7; // 7 days per week
    var day = firstOfJanuaryDate.getDay();
    day = (day === 0) ? 7 : day; // make the days monday-sunday equals to 1-7 instead of 0-6
	var dayOffset=-day+FIRST_DAY_OF_WEEK; // dayOffset will correct the date in order to get a Monday
	if (WEEK_LENGTH-day+1<4) {
		// the current week has not the minimum 4 days required by iso 8601 => add one week
		dayOffset += WEEK_LENGTH;
	}
    return new Date(firstOfJanuaryDate.getTime()+dayOffset*24*60*60*1000);
}

function parseDate(input) {
  var parts = input.split('-');
  return new Date(parts[0], parts[1]-1, parts[2]); 
}