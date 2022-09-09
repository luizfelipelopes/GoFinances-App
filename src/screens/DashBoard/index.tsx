import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { HighlightsCard } from "../../components/HighlightsCard";
import { HighlightsCards } from "../../components/HighlightsCard/styles";


import {
    Container,
    Header,
    UserInfo,
    Photo,
    User,
    UserWrapper,
    UserGreeting,
    UserName,
    Icon
 } from './styles';

export function DashBoard() {
    return(
        <Container>
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
                    amount={'R$ 17.400,00'}
                    lastTransaction={'Última entrada dia 13 de abril'} />
                <HighlightsCard
                    type={'down'}
                    title={'Saídas'}
                    amount={'R$ 1.259,00'}
                    lastTransaction={'Última saída dia 03 de abril'}/>
                <HighlightsCard
                    type={'total'}
                    title={'Total'}
                    amount={'R$ 16.141,00'}
                    lastTransaction={'01 à 16 de abril'}/>
            </HighlightsCards>
        </Container>
    );
}