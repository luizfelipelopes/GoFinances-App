import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { useTheme } from "styled-components";

import { HighlightsCard } from "../../components/HighlightsCard";
import { HighlightsCards } from "../../components/HighlightsCard/styles";
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCard";


import {
    Container,
    Header,
    UserInfo,
    Photo,
    User,
    UserWrapper,
    UserGreeting,
    UserName,
    Icon,
    Transactions,
    Title,
    TransactionsList,
    LoadContainer
 } from './styles';

 export interface DataListProps extends TransactionCardProps {
    id: string;
 }


export interface HiglightProps {
    amount: string;
    lastTransaction: string;
}

export interface HiglightData {
    entries: HiglightProps;
    expensives: HiglightProps;
    total: HiglightProps;
}

 export function DashBoard() {

    const [isLoading, setIsloading] = useState(true);
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [higlightData, setHiglightData] = useState<HiglightData>({} as HiglightData);

    const theme = useTheme();

    function getLastTransactionDate(
        collection: DataListProps[],
        type: 'positive' | 'negative'
    ) {

        const lastTransaction = new Date(
        Math.max.apply(Math, collection
            .filter(transaction => transaction.type === type)
            .map(transaction => new Date(transaction.date).getTime())));

        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`;

    }


    async function loadTransactions() {
        const dataKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let expensivesTotal = 0;

        const transactionsFormatted: DataListProps[] = transactions
        .map((item: DataListProps) => {

            if(item.type === 'positive') {
                entriesTotal += Number(item.amount);
            } else {
                expensivesTotal += Number(item.amount);
            }

            const amount = Number(item.amount)
            .toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            const date = Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            }).format(new Date(item.date));


            return {
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date
            }
        });

        setTransactions(transactionsFormatted);

        const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
        const lastTransactionExpensives = getLastTransactionDate(transactions, 'negative');
        const totalInterval = `01 a ${lastTransactionExpensives}`;


        const total = entriesTotal - expensivesTotal;

        setHiglightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: `Última entrada dia ${lastTransactionEntries}`
            },
            expensives: {
                amount: expensivesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: `Última saída dia ${lastTransactionExpensives}`
            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: totalInterval
            }
        })

        setIsloading(false);
    }

    useEffect(() => {
        loadTransactions();
    }, []);

    useFocusEffect(useCallback(() => {
        loadTransactions();
    }, []));


    return(

        <Container>

            {
                isLoading ? <LoadContainer>
                                <ActivityIndicator
                                    color={theme.colors.primary}
                                    size={"large"} />
                            </LoadContainer> :
                    <>
                        <Header>
                            <UserWrapper>
                                <UserInfo>
                                    <Photo
                                        source={{ uri: 'https://avatars.githubusercontent.com/u/12420867?v=4' }}
                                        />
                                    <User>
                                        <UserGreeting>Olá,</UserGreeting>
                                        <UserName>Luiz Felipe</UserName>
                                    </User>
                                </UserInfo>

                                <Icon name="power" />
                            </UserWrapper>
                        </Header>

                        <HighlightsCards>
                            <HighlightsCard
                                type={'up'}
                                title={'Entradas'}
                                amount={higlightData.entries.amount}
                                lastTransaction={higlightData.entries.lastTransaction} />
                            <HighlightsCard
                                type={'down'}
                                title={'Saídas'}
                                amount={higlightData.expensives.amount}
                                lastTransaction={higlightData.expensives.lastTransaction} />
                            <HighlightsCard
                                type={'total'}
                                title={'Total'}
                                amount={higlightData.total.amount}
                                lastTransaction={higlightData.total.lastTransaction}/>
                        </HighlightsCards>

                        <Transactions>
                            <Title>Listagem</Title>

                            <TransactionsList
                                data={transactions}
                                keyExtractor={ item => item.id }
                                renderItem={({ item }) => <TransactionCard data={item} />}
                            />



                        </Transactions>

                    </>
            }


        </Container>
    );
}