import { StyleSheet } from 'react-native';

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  buttonWrapper: {
    width: '60%',
  },
});


const CardStyles = StyleSheet.create({
    card: {
      backgroundColor: '#ffffee',
      padding: 20,
      borderRadius: 12,
      elevation: 5, 
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      margin: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333',
    },
    content: {
      fontSize: 16,
      color: '#555',
      marginBottom: 8,
    },
    buttonContainer: {
      marginTop: 15,
    },
  });

const TextStyles = StyleSheet.create({
  text1: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '400',
    lineHeight: 24,
    justifyContent : 'center',
  },
  text2: {
    fontSize: 14,
    color: '#888888',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  titre: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginVertical: 16,
  },
});

export default {Styles, CardStyles, TextStyles}
