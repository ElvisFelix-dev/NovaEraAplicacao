import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
`;

const Title = styled.Text`
  font-size: 22px;
  margin-bottom: 10px;
  color: #333;
`;

const StyledButton = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 12px 20px;
  border-radius: 8px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

export default function Home({ navigation }) {
  return (
    <Container>
      <Title>Home Screen</Title>
      <StyledButton onPress={() => navigation.navigate('Details')}>
        <ButtonText>Ir para Detalhes</ButtonText>
      </StyledButton>
    </Container>
  );
}
