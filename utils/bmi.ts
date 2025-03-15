// utils/bmi.ts
export const getBmiStatus = (bmi: number) => {
    if (bmi < 18.5) return {
        status: 'Underweight',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        description: 'Consider consulting a nutritionist'
    }
    if (bmi < 25) return {
        status: 'Normal weight',
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        description: 'Healthy range - good job!'
    }
    if (bmi < 30) return {
        status: 'Overweight',
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        description: 'Consider increasing physical activity'
    }
    return {
        status: 'Obese',
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        description: 'Recommend consulting a health professional'
    }
}