export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
};

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};
