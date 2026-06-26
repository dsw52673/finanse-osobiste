import { getTransactionsData, getAnalyticsByCategoryData, getAnalyticsByPeriodData } from '../../../lib/queries/finance'
import AnalyticsView from '../components/analytics-view'

export default async function AnalyticsPage() {
    const dateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

    const [transactions, analyticsByCategory, analyticsByPeriodMonth, analyticsByPeriodDay] = await Promise.all([
        getTransactionsData(),
        getAnalyticsByCategoryData(),
        getAnalyticsByPeriodData({ groupBy: 'month' }),
        getAnalyticsByPeriodData({ groupBy: 'day', dateFrom })
    ])

    let totalIncome = 0
    let totalExpenses = 0
    for (const t of transactions) {
        if (t.type === 'INCOME') {
            totalIncome += t.amount
        } else {
            totalExpenses += t.amount
        }
    }
    const availableFunds = totalIncome - totalExpenses

    const categoryChartData = (analyticsByCategory.data || []).map(item => ({
        name: item.name,
        value: item.value
    }))

    const dailyPeriodData = analyticsByPeriodDay.data || []
    const totalPeriodNetChange = dailyPeriodData.reduce((sum, item) => sum + (item.income - item.expenses), 0)
    let runningBalance = availableFunds - totalPeriodNetChange

    const balanceChartData = dailyPeriodData.map(item => {
        runningBalance += (item.income - item.expenses)
        const parts = item.period.split('-')
        const dateLabel = parts.length === 3 ? `${parts[2]}.${parts[1]}` : item.period
        return {
            name: dateLabel,
            Saldo: parseFloat(runningBalance.toFixed(2))
        }
    })

    const monthlyPeriodData = analyticsByPeriodMonth.data || []
    const monthNames: Record<string, string> = {
        '01': 'Sty', '02': 'Lut', '03': 'Mar', '04': 'Kwi', '05': 'Maj', '06': 'Cze',
        '07': 'Lip', '08': 'Sie', '09': 'Wrz', '10': 'Paź', '11': 'Lis', '12': 'Gru'
    }

    const incomeExpensesChartData = monthlyPeriodData.map(item => {
        const parts = item.period.split('-')
        const label = parts.length === 2 ? `${monthNames[parts[1]]} ${parts[0].slice(2)}` : item.period
        return {
            name: label,
            Przychody: item.income,
            Wydatki: item.expenses
        }
    })

    const monthlyExpensesChartData = monthlyPeriodData.map(item => {
        const parts = item.period.split('-')
        const label = parts.length === 2 ? `${monthNames[parts[1]]} ${parts[0].slice(2)}` : item.period
        return {
            name: label,
            Kwota: item.expenses
        }
    })

    const totalPeriodSavingsChange = monthlyPeriodData.reduce((sum, item) => sum + (item.income - item.expenses), 0)
    let runningSavings = availableFunds - totalPeriodSavingsChange

    const cumulativeSavingsChartData = monthlyPeriodData.map(item => {
        runningSavings += (item.income - item.expenses)
        const fullMonthNames: Record<string, string> = {
            '01': 'Styczeń', '02': 'Luty', '03': 'Marzec', '04': 'Kwiecień', '05': 'Maj', '06': 'Czerwiec',
            '07': 'Lipiec', '08': 'Sierpień', '09': 'Wrzesień', '10': 'Październik', '11': 'Listopad', '12': 'Grudzień'
        }
        const parts = item.period.split('-')
        const label = parts.length === 2 ? `${fullMonthNames[parts[1]]} ${parts[0]}` : item.period
        return {
            name: label,
            Oszczędności: parseFloat(runningSavings.toFixed(2))
        }
    })

    return (
        <div className="flex-1 flex flex-col gap-6">
            <AnalyticsView
                categoryData={categoryChartData}
                balanceData={balanceChartData}
                incomeExpensesData={incomeExpensesChartData}
                monthlyExpensesData={monthlyExpensesChartData}
                cumulativeSavingsData={cumulativeSavingsChartData}
            />
        </div>
    )
}
