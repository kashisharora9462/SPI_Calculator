const gradeMapping = {
    'AA': 10,
    'AB': 9,
    'BB': 8,
    'BC': 7,
    'CC': 6,
    'CD': 5,
    'DD': 4
};

let currentSemester = 1; // Track the current semester

function selectSemester(semester) {
    currentSemester = semester; // Update the current semester
    const branch = document.getElementById('branch').value;
    const tableBody = document.getElementById('table').querySelector('tbody');
    const title = document.getElementById('semester');
    title.textContent = `SEMESTER ${semester} (${branch})`;

    tableBody.innerHTML = '';

    if (data[branch] && data[branch][semester]) {
        data[branch][semester].forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.subject}</td>
                <td>${item.credit}</td>
                <td contenteditable="true"></td>
                <td contenteditable="true"></td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Clear total and SPI fields
    document.getElementById('credit-total').textContent = '';
    document.getElementById('best-credit-total').textContent = '';
    document.getElementById('least-credit-total').textContent = '';
    document.getElementById('best-spi').textContent = '';
    document.getElementById('least-spi').textContent = '';
    
}

function updateTable() {
    selectSemester(currentSemester); // Use the current semester when updating the table
}

function open_sidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = "flex";
}

function close_sidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = "none";
}

function calculateSPI() {
    let bestcreditTotal = 0;
    let leastcreditTotal = 0;
    let totalCredit = 0;

    const rows = document.querySelectorAll('#table tbody tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const credits = parseFloat(cells[2].textContent);
        const bestGrade = gradeMapping[cells[3].textContent.trim().toUpperCase()] || 0;
        const leastGrade = gradeMapping[cells[4].textContent.trim().toUpperCase()] || 0;

        if (!isNaN(credits)) {
            totalCredit += credits;
        }

        if (!isNaN(bestGrade) && bestGrade !== 0) {
            bestcreditTotal += bestGrade * credits;
        }

        if (!isNaN(leastGrade) && leastGrade !== 0) {
            leastcreditTotal += leastGrade * credits;
        }
    });

    const bestSPI = bestcreditTotal / totalCredit;
    const leastSPI = leastcreditTotal / totalCredit;
    document.getElementById('credit-total').textContent = totalCredit.toFixed(1);
    document.getElementById('best-credit-total').textContent = bestcreditTotal.toFixed(1);
    document.getElementById('least-credit-total').textContent = leastcreditTotal.toFixed(1);
    document.getElementById('best-spi').textContent = bestSPI.toFixed(2);
    document.getElementById('least-spi').textContent = leastSPI.toFixed(2);

    const targetcpi = document.getElementById('targetcpi');
    targetcpi.style.display = "flex"; // Show the targetcpi section after calculating SPI

    const main = document.querySelector('.main');
    main.style.display = "flex"; // Show the second (table) section after calculating SPI

    const calculateButton = document.getElementById('calculate-button');
    calculateButton.style.display="none";
}


function target() {
    

    const main = document.querySelector('.main');
    main.style.display = "none"; 

    const box = document.getElementById('box');
    box.style.display = "flex"; // Show the box section

    const targetInput = document.getElementById('target');
    targetInput.focus(); // Focus on the input field for CPI

   
}

function getTotalCredit(department, n) {
    let totalCredits = 0;

    for (let semester = 1; semester <= n; semester++) {
        if (data[department][semester]) {
            data[department][semester].forEach(subject => {
                totalCredits += subject.credit;
            });
        }
    }

    return totalCredits;
}

function showtarget(){
   // Get values from input fields
   var targetCPI = parseFloat(document.getElementById('target').value);
   var currentCPI = parseFloat(document.getElementById('currentcpi').value);
   var currentSemester = parseInt(document.getElementById('csemester').value, 10);
   var department = document.getElementById('branch1').value.trim().toUpperCase();

   if(currentSemester<1 || currentSemester>7){
    alert('Enter a valid Semester between 1 to 7');
   }

   if(targetCPI<1 || targetCPI>10){
    alert('Enter a valid CPI');
   }

   if(currentCPI<1 || currentCPI>10){
    alert('Enter a valid current CPI');
   }

   
   var n=currentSemester;

   var totalCredit_n_semester=getTotalCredit(department,n+1);
   var totalCredit_n_1_semester=getTotalCredit(department,n);
   var nth_semester_credit= totalCredit_n_semester-totalCredit_n_1_semester;

   const first=(totalCredit_n_semester*targetCPI) - (currentCPI*totalCredit_n_1_semester);

   const targetSPI = first/nth_semester_credit;

   if(targetSPI>10||targetSPI<0){
    alert(`This target is not achievable as per your current ${currentCPI} Cpi `);
   }
   else{
    alert(`You have to target ${targetSPI.toFixed(2)} to get your ${targetCPI} CPI `);
   }
}

document.addEventListener('DOMContentLoaded', function() {
    updateTable();

    const icon = document.getElementById('icon');
    const close = document.getElementById('close');
    const calculateButton = document.getElementById('calculate-button');
    const targetCalculate = document.getElementById('targetcalculate');
   
    icon.addEventListener("click", open_sidebar); // open sidebar
    close.addEventListener("click", close_sidebar); // close sidebar 
   
  
    document.getElementById('findspi').addEventListener('click', showtarget);
    


    // Event listener for branch change
    document.getElementById('branch').addEventListener('change', function() {
        updateTable();
    });
     // Event listener for calculate button
     calculateButton.addEventListener('click', calculateSPI);
     

        // Event listener for target CPI link
        targetCalculate.addEventListener('click', target);

});
