interface Consumption {
    length: number;
    consumption_id: number;
    counter_id: number;
    consumption_date: Date;
    consumption_counts: number[]
  }

export async function saveMonthlyCounts(){
    const todaysCounts = await prisma.dailyConsumption.findMany({
        where:{
            consumption_date: dayjs().utc().startOf('day').toDate()
        }})

    for(let i = 0; i<todaysCounts.length; i++){        
        const counterId = todaysCounts[i].counter_id
        const lastItem = todaysCounts[i].consumption_counts.length -1
        const startOfCurrentMonth:Date = dayjs().utc().startOf('month').toDate()
        const todaysConsumption:number = todaysCounts[i].consumption_counts[lastItem] - todaysCounts[i].consumption_counts[0]
        const currentMonthsTable = await prisma.monthlyConsumption.findFirst({where: {counter_id: counterId, consumption_month: startOfCurrentMonth}})

        if(currentMonthsTable){
            const consumptionId:number = currentMonthsTable.consumption_id
            const arrayOfMonthlyCounts:number[] = currentMonthsTable.consumption_month_counts
            arrayOfMonthlyCounts.push(todaysConsumption)
            await prisma.monthlyConsumption.update({
                where: {consumption_id: consumptionId},
                data: {consumption_month_counts: arrayOfMonthlyCounts}
            })
        }else{
            await prisma.monthlyConsumption.create({ 
                data: {
                    counter_id: counterId,
                    consumption_month_counts: todaysConsumption,
                    consumption_month: startOfCurrentMonth
                }
            })
        }
    }  

}