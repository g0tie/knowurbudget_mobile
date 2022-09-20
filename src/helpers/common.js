import {getByDate, getData, getExpensesByType, getDatas, getCurrentUser} from  "../store/database";

function calculatePercentage(value, max) {
    if (max < value) return 100;
    return (value / max) * 100;
}

function getTypeName(id) {
    return getData(parseInt(id), 'types')?.name;
}

function calculateTotalExpenses(expenses)
{   
    if (!expenses) return 0;
    return expenses.reduce((prev, curr) => prev + parseInt(curr.amount), 0);
}

function getDatetime() {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
}


function sortExpensesByMonths(expenses, types) {
    let datasets = [];
    let colors = [
        '#083d77',
        '#f97068',
        '#f9dc5c',
        '#7d1d3f',
        '#2fbf71',
        '#e86a92',
        '#e86a92',
        '#4f46e5'
    ];

    types.forEach((type, key) => {

        datasets[key] = {
            id: key,
            label:type.name,
            data: totalExpensesByMonth(expenses.filter(expense => getTypeName(expense.typeid) === type.name)),
            backgroundColor: colors[key]
        }
      
    });
    return datasets;
}

function totalExpensesByMonth(expenses) {
    let result = [];
    
    for (let i = 0; i < 12; i++) {
        let month = i < 9 ? `0${i + 1}` : i + 1;
        let monthString = new Date().getFullYear() + '-' + month;
        
        result.push(expenses.map(expense => {
            if (expense.date.includes(monthString)) {
                return expense.amount
            } else {
                return 0;
            }
        })
        .reduce((prev, curr) => prev + parseInt(curr), 0)
        )
        
    }

    return result;
}

function sortExpensesByWeek(types)
{
    let weekStart = new Date().getDate() - new Date().getDay() +1
    let weekEnd = weekStart + 6; 

    let weekStringStart = new Date().getFullYear() + `-0${new Date().getMonth() + 1}-${weekStart}`;
    let weekStringEnd =  new Date().getFullYear() + `-0${new Date().getMonth() + 1}-${weekEnd}`;

    return getTotalExpensesByType(
        getByDate('expenses', weekStringStart, weekStringEnd, getCurrentUser()),
        types
    );
}

function getTotalExpensesByType(expenses, types)
{
    let results = [];

    types.forEach(type => {

        results.push(
            expenses.map(expense => {
                if (getTypeName(expense.typeid) === type.name)  {
                    return expense.amount
                } else {
                    return 0;
                }
            })
            .reduce((prev, curr) => prev + parseInt(curr), 0)
        );

    });

    return results;
}

async function getDefaultUserData(state)
{
    const user =  await getData(getCurrentUser(), "users");
    const limit = await  await getData(getCurrentUser(), "limit");
    const expenses = await getDatas("expenses", getCurrentUser());
    const totalExpenses = await calculateTotalExpenses(expenses);

    let newState = await {
      ...state, 
      limit: { value: limit.amount },
      expenses,
      totalExpenses,
      user : {name:user.username},
      logged: false
    } ;

    return newState;
}

export {
    calculatePercentage,
    getTypeName,
    calculateTotalExpenses,
    getDatetime,
    sortExpensesByWeek,
    sortExpensesByMonths,
    getDefaultUserData
}