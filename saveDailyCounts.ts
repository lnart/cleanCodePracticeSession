export async function saveDailyCounts(){
    const allCounters : any[] = await prisma.counter.findMany()
    for(let i = 0; i < allCounters.length; i++){
        const startOfDay:string = dayjs().utc().startOf('day').toISOString()
        const counter_id:number = allCounters[i].counter_id
        const count:number = allCounters[i].count
        const dailyCounts = await prisma.dailyConsumption.findFirst({where:{counter_id, consumption_date: startOfDay}})
        if(!dailyCounts){
            await prisma.dailyConsumption.create({data:{
                counter_id: counter_id,
                consumption_date: startOfDay,
                consumption_counts: [count]
            }})
        }else{
            const consumptionCounts:number[] = dailyCounts.consumption_counts
            consumptionCounts.push(count)
            await prisma.dailyConsumption.update({
                where: {consumption_id: dailyCounts.consumption_id},
                data: {consumption_counts: consumptionCounts}
            })

        }
    }
}

export function executeEveryNewHour(){
    const now = dayjs().utc()
    const millisUntilNextHour = dayjs(now).endOf('hour').diff(now)

    setTimeout(count.saveDailyCounts, millisUntilNextHour)
}