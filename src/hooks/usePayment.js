import { useMutation } from '@tanstack/react-query';
import { createCheckoutSession } from '../api/endpoints';
import toast from 'react-hot-toast';

export const usePayment = () => {
    const checkout = useMutation({
        mutationFn: async ({ amount, purpose, issueId }) => {
            const response = await createCheckoutSession({
                amount,
                purpose,
                issueId,
            });
            return response.data;
        },
        onSuccess: async (data) => {
            if (data.data?.url) {
                // Redirect to Stripe Checkout page
                window.location.href = data.data.url;
            } else {
                toast.error('Failed to create checkout session - no redirect URL');
            }
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Payment failed');
        },
    });

    const boostIssue = (issueId) => {
        return checkout.mutate({
            amount: 100,
            purpose: 'boost',
            issueId,
        });
    };

    const subscribePremium = () => {
        return checkout.mutate({
            amount: 1000,
            purpose: 'premium',
        });
    };

    return {
        boostIssue,
        subscribePremium,
        isLoading: checkout.isPending,
    };
};
