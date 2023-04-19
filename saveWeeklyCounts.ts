export async function readWeeklyCounts(){
    const currentWeek = dayjs().utc().isoWeek()
    const allDailyCounts = await prisma.dailyConsumption.findMany()
    const dailyCountsOfCurrentWeek = []
    for(let i = 0; i < allDailyCounts.length; i++){    
        if(allDailyCounts[i].consumption_date.toISOString() === dayjs().utc().startOf('day').toISOString()){
            dailyCountsOfCurrentWeek.push(allDailyCounts[i])
        }
    }
    return dailyCountsOfCurrentWeek
}


export async function saveWeeklyCounts() {
    const arrayOfDays = await reader.readWeeklyCounts
    for(let i = 0; i < arrayOfDays.length; i++){
        const startOfWeek:string = getNextDay(dayjs().startOf('week').utc().toDate()).toISOString()
        const counter_id:number = arrayOfDays[i].counter_id
        const lastItem:number = arrayOfDays[i].consumption_counts.length -1
        const countOfTheDay:number = arrayOfDays[i].consumption_counts[lastItem] - arrayOfDays[i].consumption_counts[0]
        const weeklyConsumptionTable = await prisma.weeklyConsumption.findFirst({where: {counter_id: counter_id, consumption_week_start: startOfWeek}})

        if(!weeklyConsumptionTable){            
            await prisma.weeklyConsumption.create({
                data: {
                  counter_id: counter_id,
                  consumption_week_start: startOfWeek,
                  consumption_week_counts: [countOfTheDay]
                }
            })
        }else{
            const weeklyCounts:number[] = weeklyConsumptionTable.consumption_week_counts
            const consumption_id:number = weeklyConsumptionTable.consumption_id
            weeklyCounts.push(countOfTheDay)
            await prisma.weeklyConsumption.update({where:{consumption_id:consumption_id}, data: {consumption_week_counts: weeklyCounts}})
        }
    } 
    
}

export async function executeSaveWeeklyCountsDaily(){
    const now  = dayjs().utc()    
    if(now.isSame(now.endOf('day'))){
        const dongs = await read.readWeeklyCounts()
        count.saveWeeklyCounts(dongs)
    }
}