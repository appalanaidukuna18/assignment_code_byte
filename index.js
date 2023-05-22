async function JSONData() {
    const response = await fetch("https://rc-vault-fap-live-1.azurewebsites.net/api/gettimeentries?code=vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ==");
    const jsonData = await response.json();
    let tableBody = '';
    let dummyArray = [];
    let output = [];
    jsonData.forEach((element, index) => {
        const userExists = jsonData.filter((user) => user.EmployeeName === element.EmployeeName);
        if (userExists.length && !dummyArray.includes(element.EmployeeName)) {
            dummyArray.push(element.EmployeeName);
            const date1 = new Date(element.StarTimeUtc);
            const date2 = new Date(element.EndTimeUtc);
            const differenceMs = Math.abs(date1.getTime() - date2.getTime());
            const value = differenceMs / (1000 * 60 * 60);
            output = [...output, {employeeName: element.EmployeeName, workingHours: value}]
        } else {
            let index = output.findIndex((user) => user.employeeName === element.EmployeeName);
            if (index > -1) {
                const date1 = new Date(element.StarTimeUtc);
                const date2 = new Date(element.EndTimeUtc);
                const differenceMs = Math.abs(date1.getTime() - date2.getTime());
                const value = differenceMs / (1000 * 60 * 60);
                output[index].workingHours = output[index].workingHours + value;
            }
        }
    });
    let totalHours = 0;
    output.forEach((data, index) => {
        totalHours = totalHours + data.workingHours;
        tableBody = tableBody + `<tr class="${data.workingHours < 100 ? 'red': ''}">
        <td>${index + 1}</td>
        <td>${data.employeeName}</td>
        <td>${data.workingHours} hours</td>
        </tr>`
    });
    output.forEach((data, index) => {
        output[index].workingPercentage = data.workingHours/(totalHours/100);
        output[index].color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    });
    const pieChartDetails = output.map((user) => ({x: user.employeeName, value: user.workingHours}))
    var chart = anychart.pie();
    chart.title("Employees Time entry App");
    chart.data(pieChartDetails);
    chart.container('pieChart');
    chart.draw();
    document.getElementById("tableBody").innerHTML = tableBody;
}

JSONData();