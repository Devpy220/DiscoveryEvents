import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar, MapPin, Music, Play } from 'lucide-react-native';

export default function HomeScreen() {
  const events = [
    {
      id: 1,
      title: 'Show do Thiaguinho',
      date: '15 de Agosto, 2025',
      location: 'Allianz Parque, São Paulo',
      image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=80',
      price: 'R$ 250,00'
    },
    {
      id: 2,
      title: 'Festival Sertanejo',
      date: '20 de Agosto, 2025',
      location: 'Arena Corinthians',
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=80',
      price: 'R$ 180,00'
    },
    {
      id: 3,
      title: 'Show da Marília Mendonça',
      date: '25 de Agosto, 2025',
      location: 'Mineirão, Belo Horizonte',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
      price: 'R$ 220,00'
    }
  ];

  const promos = [
    {
      id: 1,
      title: 'Compre 3, Pague 2!',
      description: 'Na compra de 3 ingressos, o mais barato sai de graça!',
      validUntil: 'Válido até 30/07/2025'
    },
    {
      id: 2,
      title: 'Desconto Estudante',
      description: 'Meia-entrada mediante apresentação de carteirinha',
      validUntil: 'Benefício garantido por lei'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Eventos em Destaque</Text>
        <Text style={styles.subtitle}>Os melhores shows perto de você</Text>
      </View>

      <View style={styles.featuredContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop&q=80' }}
          style={styles.featuredImage}
        />
        <View style={styles.featuredContent}>
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredBadgeText}>Evento em Destaque</Text>
          </View>
          <Text style={styles.featuredTitle}>Show do Theo Rosa</Text>
          <Text style={styles.featuredPrice}>A partir de R$ 150,00</Text>
        </View>
      </View>

      <View style={styles.promoSection}>
        <Text style={styles.sectionTitle}>Promoções Especiais</Text>
        {promos.map((promo) => (
          <View key={promo.id} style={styles.promoCard}>
            <Text style={styles.promoTitle}>{promo.title}</Text>
            <Text style={styles.promoDescription}>{promo.description}</Text>
            <Text style={styles.promoValidity}>{promo.validUntil}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Próximos Eventos</Text>
        {events.map((event) => (
          <TouchableOpacity key={event.id} style={styles.eventCard}>
            <Image source={{ uri: event.image }} style={styles.eventImage} />
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={styles.eventDetails}>
                <View style={styles.eventDetail}>
                  <Calendar size={16} color="#6366f1" />
                  <Text style={styles.eventDetailText}>{event.date}</Text>
                </View>
                <View style={styles.eventDetail}>
                  <MapPin size={16} color="#6366f1" />
                  <Text style={styles.eventDetailText}>{event.location}</Text>
                </View>
              </View>
              <View style={styles.eventFooter}>
                <Text style={styles.eventPrice}>{event.price}</Text>
                <TouchableOpacity style={styles.buyButton}>
                  <Text style={styles.buyButtonText}>Comprar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  featuredContainer: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  featuredImage: {
    width: '100%',
    height: 200,
  },
  featuredContent: {
    padding: 16,
  },
  featuredBadge: {
    backgroundColor: '#818cf8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  featuredBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  featuredPrice: {
    fontSize: 18,
    color: '#6366f1',
    fontWeight: '600',
  },
  promoSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  promoCard: {
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  promoDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  promoValidity: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventImage: {
    width: '100%',
    height: 150,
  },
  eventContent: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  eventDetails: {
    gap: 8,
    marginBottom: 12,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventDetailText: {
    color: '#64748b',
    fontSize: 14,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  eventPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6366f1',
  },
  buyButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buyButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});