import React from "react";
import { TouchableOpacityProps } from "react-native";

import { Container, Icon, Title } from "./styles";

const icons = {
    up: 'arrow-up-circle',
    down: 'arrow-down-circle',
}

interface TransactionTypeButonProps extends TouchableOpacityProps {
    title: string;
    type: 'up' | 'down';
    isActive: boolean;
}

export function TransactionTypeButon({title, type, isActive, ...rest}: TransactionTypeButonProps) {

    return (
        <Container
            {...rest}
            type={type}
            isActive={isActive}
        >
            <Icon
                name={icons[type]}
                type={type}
            />
            <Title>{ title }</Title>

        </Container>
    )
}