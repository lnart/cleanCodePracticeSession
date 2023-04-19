export async function saveLiveCount(count: any, topic: string){
    const UID:string = topic.split('/')[1]
    const type:string = topic.split('/')[0]
    const startOfDay:string = dayjs().utc().startOf('day').toISOString()
    const counter = await prisma.counter.findFirst({where:{user_id: +UID, type:type}})
    if(!counter){
        await prisma.counter.create({
            data: {
                user_id:parseFloat(UID),
                timestamp: startOfDay,
                count: parseFloat(count),
                type: type
            }
        })
    }else{
        const counterId:number = counter.counter_id
        await prisma.counter.update({
            where: {
                counter_id: counterId
            },
            data: {
                count:parseFloat(count),
                timestamp: startOfDay
            }
        })
    }
}