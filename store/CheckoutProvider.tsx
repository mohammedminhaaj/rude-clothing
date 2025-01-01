'use client';

import { createContext, useContext, useState } from 'react';

export type CheckoutCardIndex = 1 | 2 | 3;

type CheckoutCardState = {
    currentIndex: CheckoutCardIndex;
    allowedIndex: CheckoutCardIndex[];
};

export type ContactInformation = {
    email: string;
    subscribed?: boolean;
};

export type ShippingInformation = {
    streetAddress: string;
    building: string | null;
    city: string;
    state: string;
    postal: string;
    phone: string;
};

export enum PaymentMode {
    CASH = 'cash',
    ONLINE = 'online',
}

type CheckoutFormState = {
    contactInformation: ContactInformation;
    shippingInformation: ShippingInformation;
    paymentMode: PaymentMode;
};

type CheckoutContextProps = CheckoutCardState &
    CheckoutFormState & {
        setCurrentIndex: (index: CheckoutCardIndex) => void;
        addAllowedIndex: (
            index: CheckoutCardIndex,
            currentIndex?: CheckoutCardIndex
        ) => void;
        isCompleted: (index: CheckoutCardIndex) => boolean;
        // setContactInformation: (email: string, subscribed?: boolean) => void;
        // setShippingInformation: (
        //     street: string,
        //     building: string | null,
        //     city: string,
        //     state: string,
        //     postal: string,
        //     phone: string
        // ) => void;
        // setPaymentMode: (mode: PaymentMode) => void;
    };

const CheckoutContext = createContext<CheckoutContextProps>({
    currentIndex: 1,
    allowedIndex: [1],
    contactInformation: {
        email: '',
    },
    shippingInformation: {
        streetAddress: '',
        building: null,
        city: '',
        state: '',
        postal: '',
        phone: '',
    },
    paymentMode: PaymentMode.CASH,
    setCurrentIndex: (index) => {},
    addAllowedIndex: (index, currentIndex) => {},
    isCompleted: (index) => false,
    // setContactInformation: (email, subscribed?) => {},
    // setShippingInformation: (
    //     street,
    //     building,
    //     city,
    //     state,
    //     postal,
    //     phone
    // ) => {},
    // setPaymentMode: (mode) => {},
});

export const CheckoutProvider = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const [{ currentIndex, allowedIndex }, setCheckoutState] =
        useState<CheckoutCardState>({
            currentIndex: 1,
            allowedIndex: [1],
        });

    const [
        { contactInformation, paymentMode, shippingInformation },
        setCheckoutFormState,
    ] = useState<CheckoutFormState>({
        contactInformation: {
            email: '',
        },
        shippingInformation: {
            streetAddress: '',
            building: null,
            city: '',
            state: '',
            postal: '',
            phone: '',
        },
        paymentMode: PaymentMode.CASH,
    });

    const setCurrentIndex = (index: CheckoutCardIndex) => {
        setCheckoutState((prev) => ({ ...prev, currentIndex: index }));
    };

    const addAllowedIndex = (
        index: CheckoutCardIndex,
        currentIndex?: CheckoutCardIndex
    ) => {
        if (allowedIndex.includes(index)) return;

        setCheckoutState((prev) => ({
            ...prev,
            allowedIndex: [...prev.allowedIndex, index],
            currentIndex: currentIndex ?? prev.currentIndex,
        }));
    };

    // const setContactInformation = (email: string, subscribed?: boolean) => {
    //     setCheckoutFormState((prev) => ({
    //         ...prev,
    //         contactInformation: {
    //             email: email,
    //             subscribed: subscribed,
    //         },
    //     }));
    // };

    // const setShippingInformation = (
    //     street: string,
    //     building: string | null,
    //     city: string,
    //     state: string,
    //     postal: string,
    //     phone: string
    // ) => {
    //     setCheckoutFormState((prev) => ({
    //         ...prev,
    //         shippingInformation: {
    //             streetAddress: street,
    //             building: building,
    //             city: city,
    //             phone: phone,
    //             postal: postal,
    //             state: state,
    //         },
    //     }));
    // };

    // const setPaymentMode = (mode: PaymentMode) => {
    //     setCheckoutFormState((prev) => ({ ...prev, paymentMode: mode }));
    // };

    const isCompleted = (index: CheckoutCardIndex) =>
        allowedIndex.includes((index + 1) as CheckoutCardIndex);

    return (
        <CheckoutContext.Provider
            value={{
                contactInformation,
                shippingInformation,
                paymentMode,
                currentIndex,
                allowedIndex,
                setCurrentIndex,
                addAllowedIndex,
                isCompleted,
                // setContactInformation,
                // setShippingInformation,
                // setPaymentMode,
            }}
        >
            {children}
        </CheckoutContext.Provider>
    );
};

export const useCheckoutContext: () => CheckoutContextProps = () =>
    useContext(CheckoutContext);
