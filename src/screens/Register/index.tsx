import React, { useEffect, useState } from "react";
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from "react-native";
import * as Yup from 'yup';
import { yupResolver  } from '@hookform/resolvers/yup';
import uuid from 'react-native-uuid';

import { Button } from "../../components/Forms/Button";
import { CategorySelectButton } from "../../components/Forms/CategorySelectButton";
import { useForm } from "react-hook-form";
import { InputForm } from "../../components/Forms/InputForm";
import { TransactionTypeButon } from "../../components/Forms/TransactionTypeButton";

import { CategorySelect } from '../CategorySelect';



import {
    Container,
    Fields,
    Form,
    Header,
    Title,
    TransactionsType
 } from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

interface FormData {
    name: string;
    amount: string;
}

const schema = Yup.object().shape({
    name: Yup
    .string()
    .required('Nome é obrigatório'),
    amount: Yup.
    number()
    .typeError('Informe um valor numérico')
    .positive('O valor não pode ser negativo')
    .required('Valor é obrigatório')
});

export function Register() {

    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);



    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria'
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    const navigation = useNavigation();

    function handleTransactionTypeSelect(type: 'positive' | 'negative') {
        setTransactionType(type);
    }

    function handleModalOpenSelectCategory() {
        setCategoryModalOpen(true);
    }

    function handleModalCloseSelectCategory() {
        setCategoryModalOpen(false);
    }

    async function handleRegister(form: Partial<FormData>) {

        const dataKey = '@gofinances:transactions';

        if(!transactionType) {
            return Alert.alert('Selecione o tipo da transação.') ;
        }

        if(category.key === 'category') {
            return Alert.alert('Selecione a categoria.') ;
        }

        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date()
        }

        try {
            const data = await AsyncStorage.getItem(dataKey);

            const currentData = data ? JSON.parse(data) : [];

            const dataFormatted = [
                ...currentData,
                newTransaction
            ];

            console.log(dataFormatted);

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

            reset();
            setTransactionType('');
            setCategory({
                key: 'category',
                name: 'Categoria'
            });

            navigation.navigate('Listagem');

        } catch (error) {
            console.log(error);
            Alert.alert("Não foi possível salvar");
        }

        // console.log(data);
    }


    // useEffect(() => {
    //     async function removeAll() {

    //         const dataKey = '@gofinances:transactions';
    //         await AsyncStorage.removeItem(dataKey);

    //         const data = await AsyncStorage.getItem(dataKey);
    //         console.log(data);
    //     }

    //     removeAll();



    // })

    return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>

                <Header>
                    <Title>Cadastro</Title>
                </Header>

                <Form>
                    <Fields>
                        <InputForm
                            name="name"
                            control={control}
                            placeholder="Nome"
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                            />
                        <InputForm
                            name="amount"
                            control={control}
                            placeholder="Preço"
                            keyboardType="numeric"
                            error={errors.amount && errors.amount.message}
                            />

                        <TransactionsType>

                            <TransactionTypeButon
                                title="Income"
                                type="up"
                                onPress={() => handleTransactionTypeSelect('positive')}
                                isActive={transactionType === 'positive'}
                                />

                            <TransactionTypeButon
                                title="Outcome"
                                type="down"
                                onPress={() => handleTransactionTypeSelect('negative')}
                                isActive={transactionType === 'negative'}
                                />

                        </TransactionsType>

                        <CategorySelectButton
                            title={category.name}
                            onPress={handleModalOpenSelectCategory}
                            />
                    </Fields>

                    <Button
                        title="Enviar"
                        onPress={handleSubmit(handleRegister)}/>
                </Form>


                <Modal visible={categoryModalOpen}>
                    <CategorySelect
                        category={category}
                        setCategory={setCategory}
                        closeSelectedCategory={handleModalCloseSelectCategory}
                    />
                </Modal>

            </Container>
        </TouchableWithoutFeedback>
    )
}