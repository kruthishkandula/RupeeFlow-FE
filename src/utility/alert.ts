import Alert from "@/components/Alert/Alert"

export const dynamicErrorAlert = (error: any) => {
    return Alert.error({
        title: error?.name || 'Error',
        message: error?.message || 'Something went wrong. Please try again.'
    })
}