
/**
 * Knowledge & Context Sources Integration
 * Provides news, weather, maps, and knowledge base access
 */

import { Platform } from 'react-native';

/**
 * News API Integration
 * For daily briefings and trend analysis
 */
export class NewsService {
  private static API_KEY = 'YOUR_NEWS_API_KEY'; // Replace with actual key
  private static BASE_URL = 'https://newsapi.org/v2';

  /**
   * Get top headlines
   */
  static async getTopHeadlines(category?: string): Promise<any[]> {
    try {
      const url = `${this.BASE_URL}/top-headlines?country=us${
        category ? `&category=${category}` : ''
      }&apiKey=${this.API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      return data.articles || [];
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }

  /**
   * Search news by query
   */
  static async searchNews(query: string): Promise<any[]> {
    try {
      const url = `${this.BASE_URL}/everything?q=${encodeURIComponent(
        query
      )}&apiKey=${this.API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      return data.articles || [];
    } catch (error) {
      console.error('Error searching news:', error);
      return [];
    }
  }

  /**
   * Get daily briefing
   */
  static async getDailyBriefing(): Promise<{
    topStories: any[];
    business: any[];
    technology: any[];
  }> {
    try {
      const [topStories, business, technology] = await Promise.all([
        this.getTopHeadlines(),
        this.getTopHeadlines('business'),
        this.getTopHeadlines('technology'),
      ]);

      return {
        topStories: topStories.slice(0, 5),
        business: business.slice(0, 3),
        technology: technology.slice(0, 3),
      };
    } catch (error) {
      console.error('Error getting daily briefing:', error);
      return { topStories: [], business: [], technology: [] };
    }
  }
}

/**
 * Weather API Integration
 * For travel prep and scheduling
 */
export class WeatherService {
  private static API_KEY = 'YOUR_OPENWEATHER_API_KEY'; // Replace with actual key
  private static BASE_URL = 'https://api.openweathermap.org/data/2.5';

  /**
   * Get current weather
   */
  static async getCurrentWeather(
    lat: number,
    lon: number
  ): Promise<any> {
    try {
      const url = `${this.BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      return {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        icon: data.weather[0].icon,
      };
    } catch (error) {
      console.error('Error fetching weather:', error);
      return null;
    }
  }

  /**
   * Get weather forecast
   */
  static async getForecast(
    lat: number,
    lon: number,
    days: number = 5
  ): Promise<any[]> {
    try {
      const url = `${this.BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${this.API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      return data.list.slice(0, days * 8).map((item: any) => ({
        date: new Date(item.dt * 1000),
        temperature: Math.round(item.main.temp),
        condition: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
      }));
    } catch (error) {
      console.error('Error fetching forecast:', error);
      return [];
    }
  }

  /**
   * Get weather by city name
   */
  static async getWeatherByCity(city: string): Promise<any> {
    try {
      const url = `${this.BASE_URL}/weather?q=${encodeURIComponent(
        city
      )}&units=metric&appid=${this.API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      return {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        icon: data.weather[0].icon,
      };
    } catch (error) {
      console.error('Error fetching weather by city:', error);
      return null;
    }
  }
}

/**
 * Maps & Location Service
 * For travel routes and nearby meetings
 * Note: react-native-maps is not supported in Natively
 */
export class MapsService {
  private static API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with actual key

  /**
   * Get directions between two points
   */
  static async getDirections(
    origin: string,
    destination: string
  ): Promise<any> {
    try {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
        origin
      )}&destination=${encodeURIComponent(destination)}&key=${this.API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        return {
          distance: route.legs[0].distance.text,
          duration: route.legs[0].duration.text,
          steps: route.legs[0].steps.map((step: any) => ({
            instruction: step.html_instructions.replace(/<[^>]*>/g, ''),
            distance: step.distance.text,
            duration: step.duration.text,
          })),
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting directions:', error);
      return null;
    }
  }

  /**
   * Search nearby places
   */
  static async searchNearby(
    lat: number,
    lon: number,
    type: string,
    radius: number = 1000
  ): Promise<any[]> {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&type=${type}&key=${this.API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      return (data.results || []).map((place: any) => ({
        name: place.name,
        address: place.vicinity,
        rating: place.rating,
        distance: this.calculateDistance(
          lat,
          lon,
          place.geometry.location.lat,
          place.geometry.location.lng
        ),
      }));
    } catch (error) {
      console.error('Error searching nearby:', error);
      return [];
    }
  }

  /**
   * Calculate distance between two coordinates
   */
  private static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): string {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  }

  private static toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

/**
 * Knowledge Base Service
 * For enriching context with external knowledge
 */
export class KnowledgeService {
  /**
   * Search Wikipedia
   */
  static async searchWikipedia(query: string): Promise<any> {
    try {
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        query
      )}`;

      const response = await fetch(url);
      const data = await response.json();

      return {
        title: data.title,
        summary: data.extract,
        url: data.content_urls?.desktop?.page,
        thumbnail: data.thumbnail?.source,
      };
    } catch (error) {
      console.error('Error searching Wikipedia:', error);
      return null;
    }
  }

  /**
   * Get contextual information
   */
  static async getContextualInfo(topic: string): Promise<any> {
    try {
      // Search Wikipedia for the topic
      const wikiInfo = await this.searchWikipedia(topic);

      // Could also integrate with other knowledge bases here
      // e.g., company knowledge DB, documentation, etc.

      return {
        source: 'Wikipedia',
        ...wikiInfo,
      };
    } catch (error) {
      console.error('Error getting contextual info:', error);
      return null;
    }
  }

  /**
   * Enrich context with related information
   */
  static async enrichContext(context: string[]): Promise<any[]> {
    try {
      const enrichedData = await Promise.all(
        context.map((item) => this.getContextualInfo(item))
      );

      return enrichedData.filter((data) => data !== null);
    } catch (error) {
      console.error('Error enriching context:', error);
      return [];
    }
  }
}

/**
 * Context Manager
 * Combines all context sources for comprehensive awareness
 */
export class ContextManager {
  /**
   * Get comprehensive context for a location
   */
  static async getLocationContext(
    lat: number,
    lon: number,
    city: string
  ): Promise<any> {
    try {
      const [weather, news] = await Promise.all([
        WeatherService.getCurrentWeather(lat, lon),
        NewsService.searchNews(city),
      ]);

      return {
        location: { lat, lon, city },
        weather,
        localNews: news.slice(0, 3),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error getting location context:', error);
      return null;
    }
  }

  /**
   * Get daily context briefing
   */
  static async getDailyContext(): Promise<any> {
    try {
      const news = await NewsService.getDailyBriefing();

      return {
        date: new Date().toISOString(),
        news,
        // Add more context sources as needed
      };
    } catch (error) {
      console.error('Error getting daily context:', error);
      return null;
    }
  }

  /**
   * Get meeting context
   */
  static async getMeetingContext(
    meetingTitle: string,
    attendees: string[]
  ): Promise<any> {
    try {
      // Extract topics from meeting title
      const topics = meetingTitle.split(' ').filter((word) => word.length > 4);

      // Get contextual information for topics
      const contextInfo = await KnowledgeService.enrichContext(topics);

      return {
        meeting: meetingTitle,
        attendees,
        context: contextInfo,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error getting meeting context:', error);
      return null;
    }
  }
}
