// backend/src/routes/seedRoutes.ts
import express from 'express';
import mongoose from 'mongoose';
import { Experience } from '../models/Experience';
import { PromoCode } from '../models/PromoCode';

const router = express.Router();

// Simple security - use environment variable or hardcode for one-time use
const SEED_SECRET = process.env.SEED_SECRET || 'temp-seed-123';

// Generate slots function (copied from your seed.ts)
const generateSlots = (basePrice: number): Array<{
  date: Date;
  timeSlot: string;
  availableSpots: number;
  bookedSpots: number;
  price: number;
}> => {
  const slots: Array<{
    date: Date;
    timeSlot: string;
    availableSpots: number;
    bookedSpots: number;
    price: number;
  }> = [];
  const timeSlots = ['06:00 AM', '09:00 AM', '02:00 PM', '04:00 PM'];
  
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    timeSlots.forEach(timeSlot => {
      slots.push({
        date,
        timeSlot,
        availableSpots: Math.floor(Math.random() * 8) + 8, // 8-15 spots
        bookedSpots: 0,
        price: basePrice,
      });
    });
  }
  
  return slots;
};

// Your experiences data (copied from seed.ts)
const experiencesData = [
  // SOUTH INDIA - Beaches & Backwaters (8)
  {
    title: 'Goa Beach Water Sports Package',
    description: 'Complete water sports package at Calangute Beach including parasailing, jet skiing, banana ride, and speed boating. Perfect beach day adventure.',
    location: 'Calangute, Goa',
    category: 'adventure',
    basePrice: 2499,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
    duration: '3 hours',
    includedItems: ['Parasailing', 'Jet Ski', 'Banana Ride', 'Speed Boat', 'Safety gear', 'Instructor'],
    maxGroupSize: 15,
    slots: generateSlots(2499),
  },
  {
    title: 'Alleppey Backwater Houseboat Cruise',
    description: 'Luxurious overnight houseboat cruise through Kerala backwaters. Authentic Kerala cuisine, village visits, and stunning sunset views.',
    location: 'Alleppey, Kerala',
    category: 'cruise',
    basePrice: 5999,
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800',
    duration: 'Overnight',
    includedItems: ['AC Houseboat', 'All meals', 'Fishing gear', 'Village tour', 'Sunset viewing'],
    maxGroupSize: 6,
    slots: generateSlots(5999),
  },
  {
    title: 'Varkala Cliff Beach Experience',
    description: 'Explore stunning Varkala cliffs with private beach access, cliff jumping, and traditional Kerala massage. Breathtaking Arabian Sea views.',
    location: 'Varkala, Kerala',
    category: 'beach',
    basePrice: 1899,
    image: 'https://images.unsplash.com/photo-1719299948942-d6bcf2769bd2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmFya2FsYSUyMGJlYWNofGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900',
    duration: '4 hours',
    includedItems: ['Beach access', 'Cliff jumping', 'Ayurvedic massage', 'Lunch', 'Photography'],
    maxGroupSize: 12,
    slots: generateSlots(1899),
  },
  {
    title: 'Gokarna Beach Trek & Camping',
    description: 'Trek across 5 beautiful beaches of Gokarna ending with overnight beach camping, bonfire, and seafood BBQ under the stars.',
    location: 'Gokarna, Karnataka',
    category: 'trekking',
    basePrice: 2999,
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
    duration: 'Overnight',
    includedItems: ['Beach trek', 'Camping gear', 'BBQ dinner', 'Bonfire', 'Breakfast'],
    maxGroupSize: 20,
    slots: generateSlots(2999),
  },
  {
    title: 'Pondicherry French Colony Cycling',
    description: 'Cycle through French Quarter, visit Auroville, explore beaches, and enjoy French cuisine. Cultural immersion experience.',
    location: 'Pondicherry',
    category: 'trail',
    basePrice: 1299,
    image: 'https://images.unsplash.com/photo-1597073642928-48c0971f7ded?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9uZGljaGVycnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=900',
    duration: '4 hours',
    includedItems: ['Bicycle', 'Guide', 'French lunch', 'Auroville entry', 'Photography'],
    maxGroupSize: 10,
    slots: generateSlots(1299),
  },
  {
    title: 'Munnar Tea Plantation Trek',
    description: 'Guided trek through endless tea gardens, visit tea factory, tea tasting session, and photography at stunning viewpoints.',
    location: 'Munnar, Kerala',
    category: 'trekking',
    basePrice: 1499,
    image: 'https://plus.unsplash.com/premium_photo-1697730304904-2bdf66da8f2b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8TXVubmFyJTIwdGVhfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900',
    duration: '5 hours',
    includedItems: ['Expert guide', 'Tea tasting', 'Factory tour', 'Lunch', 'Transport'],
    maxGroupSize: 15,
    slots: generateSlots(1499),
  },
  {
    title: 'Hampi Ancient Ruins Exploration',
    description: 'Explore UNESCO World Heritage site with expert historian. Ancient temples, royal enclosures, and stunning boulder landscapes.',
    location: 'Hampi, Karnataka',
    category: 'trail',
    basePrice: 1799,
    image: 'https://plus.unsplash.com/premium_photo-1661964372197-876e0034f333?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8SGFtcGklMjBhbmNpZW50JTIwcnVpbnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=900',
    duration: '6 hours',
    includedItems: ['Historian guide', 'All entry tickets', 'Lunch', 'Transport', 'Guidebook'],
    maxGroupSize: 12,
    slots: generateSlots(1799),
  },
  {
    title: 'Coorg Coffee Estate Experience',
    description: 'Walk through organic coffee plantations, learn processing, coffee tasting, spice garden tour, and traditional Kodava lunch.',
    location: 'Coorg, Karnataka',
    category: 'trail',
    basePrice: 1999,
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800',
    duration: '4 hours',
    includedItems: ['Estate tour', 'Coffee tasting', 'Spice garden', 'Traditional lunch', 'Guide'],
    maxGroupSize: 8,
    slots: generateSlots(1999),
  },

  // NORTH INDIA - Mountains & Adventure (8)
  {
    title: 'Rishikesh River Rafting Extreme',
    description: 'White water rafting in Ganges with Grade 3-4 rapids. Cliff jumping, body surfing, and riverside camping included.',
    location: 'Rishikesh, Uttarakhand',
    category: 'adventure',
    basePrice: 2499,
    image: 'https://plus.unsplash.com/premium_photo-1661889971049-6f0a39a3476f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmlzaGlrZXNoJTIwcml2ZXIlMjByYWZ0aW5nfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900',
    duration: '6 hours',
    includedItems: ['Rafting gear', 'Safety equipment', 'Expert guide', 'Lunch', 'Cliff jumping'],
    maxGroupSize: 8,
    slots: generateSlots(2499),
  },
  {
    title: 'Manali Solang Valley Adventure',
    description: 'Complete adventure package: paragliding, zorbing, ATV ride, and cable car with stunning Himalayan views.',
    location: 'Manali, Himachal',
    category: 'adventure',
    basePrice: 3999,
    image: 'https://plus.unsplash.com/premium_photo-1664005044945-ab3a1282ac01?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFuYWxpJTIwdmFsbGV5fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900',
    duration: '5 hours',
    includedItems: ['Paragliding', 'Zorbing', 'ATV ride', 'Cable car', 'Photos'],
    maxGroupSize: 6,
    slots: generateSlots(3999),
  },
  {
    title: 'Shimla Heritage Walk & Toy Train',
    description: 'Explore British-era architecture, ride UNESCO toy train, visit ancient temples, and enjoy local Himachali cuisine.',
    location: 'Shimla, Himachal',
    category: 'trail',
    basePrice: 1599,
    image: 'https://images.unsplash.com/photo-1600106241408-dfd0eab6a6ba?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2hpbWxhJTIwaGVyaXRhZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=900',
    duration: '5 hours',
    includedItems: ['Toy train ticket', 'Heritage guide', 'Temple visits', 'Local lunch', 'Transport'],
    maxGroupSize: 15,
    slots: generateSlots(1599),
  },
  {
    title: 'Leh Ladakh Bike Expedition',
    description: '3-day Royal Enfield bike tour covering Pangong Lake, Nubra Valley, and highest motorable passes. Ultimate road trip.',
    location: 'Leh, Ladakh',
    category: 'adventure',
    basePrice: 18999,
    image: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?w=800',
    duration: '3 days',
    includedItems: ['Royal Enfield', 'Fuel', 'Accommodation', 'All meals', 'Guide', 'Oxygen'],
    maxGroupSize: 8,
    slots: generateSlots(18999),
  },
  {
    title: 'Kasol Kheerganga Trek',
    description: 'Famous trek to natural hot water springs through pine forests. Camping under stars with mountain views.',
    location: 'Kasol, Himachal',
    category: 'trekking',
    basePrice: 2999,
    image: 'https://plus.unsplash.com/premium_photo-1713291132092-69f80e06a15e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8a2Fzb2x8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=900',
    duration: '2 days',
    includedItems: ['Camping gear', 'All meals', 'Trek guide', 'Hot spring access', 'Transport'],
    maxGroupSize: 12,
    slots: generateSlots(2999),
  },
  {
    title: 'Mussoorie Nature Walk & Waterfalls',
    description: 'Scenic walk through cloud-kissed hills, visit multiple waterfalls, cable car ride, and colonial architecture tour.',
    location: 'Mussoorie, Uttarakhand',
    category: 'trekking',
    basePrice: 1299,
    image: 'https://images.unsplash.com/photo-1647682619646-a8014d5a5fd9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TXVzc29vcmllJTIwbmF0dXJlJTIwd2Fsa3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=900',
    duration: '4 hours',
    includedItems: ['Nature guide', 'Cable car ticket', 'Waterfall visits', 'Lunch', 'Photography'],
    maxGroupSize: 10,
    slots: generateSlots(1299),
  },
  {
    title: 'Nainital Lake Boating & Temple Tour',
    description: 'Romantic boat ride in Naini Lake, visit ancient temples, cable car to snow view point, and local market exploration.',
    location: 'Nainital, Uttarakhand',
    category: 'cruise',
    basePrice: 999,
    image: 'https://plus.unsplash.com/premium_photo-1712685912272-96569030d1d7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmFpbml0YWwlMjBsYWtlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900',
    duration: '3 hours',
    includedItems: ['Boat ride', 'Cable car', 'Temple visits', 'Guide', 'Refreshments'],
    maxGroupSize: 8,
    slots: generateSlots(999),
  },
  {
    title: 'Dharamshala Tibetan Culture Tour',
    description: 'Explore Tibetan monasteries, meet Dalai Lama temple, traditional Tibetan lunch, and handicraft market visit.',
    location: 'Dharamshala, Himachal',
    category: 'trail',
    basePrice: 1499,
    image: 'https://plus.unsplash.com/premium_photo-1661886836347-5738ab3b7728?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8RGhhcmFtc2hhbGElMjBUaWJldGFuJTIwQ3VsdHVyZSUyMFRvdXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=900',
    duration: '4 hours',
    includedItems: ['Monastery visits', 'Tibetan lunch', 'Cultural guide', 'Transport', 'Market tour'],
    maxGroupSize: 12,
    slots: generateSlots(1499),
  },

  // WEST & EAST INDIA - Diverse Experiences (9)
  {
    title: 'Udaipur Lake Palace Boat Tour',
    description: 'Romantic sunset boat tour on Lake Pichola with views of City Palace, Jag Mandir, and traditional Rajasthani music.',
    location: 'Udaipur, Rajasthan',
    category: 'cruise',
    basePrice: 1999,
    image: 'https://images.unsplash.com/photo-1630307510909-520d4a60142b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fFVkYWlwdXIlMjBMYWtlJTIwUGFsYWNlJTIwQm9hdCUyMFRvdXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=900',
    duration: '2 hours',
    includedItems: ['Boat cruise', 'Live music', 'Refreshments', 'Photography', 'Sunset viewing'],
    maxGroupSize: 20,
    slots: generateSlots(1999),
  },
  {
    title: 'Jaipur Amber Fort Elephant Ride',
    description: 'Elephant ride to Amber Fort, light and sound show, traditional Rajasthani dinner, and cultural performance.',
    location: 'Jaipur, Rajasthan',
    category: 'adventure',
    basePrice: 2999,
    image: 'https://plus.unsplash.com/premium_photo-1691031429261-aeb324882888?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8SmFpcHVyJTIwQW1iZXIlMjBGb3J0JTIwRWxlcGhhbnQlMjBSaWRlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900',
    duration: '4 hours',
    includedItems: ['Elephant ride', 'Fort entry', 'Light show', 'Dinner', 'Cultural show'],
    maxGroupSize: 4,
    slots: generateSlots(2999),
  },
  {
    title: 'Jaisalmer Desert Safari & Camping',
    description: 'Camel safari in Thar Desert, traditional folk music, stargazing, and luxury desert camping with bonfire.',
    location: 'Jaisalmer, Rajasthan',
    category: 'adventure',
    basePrice: 3499,
    image: 'https://images.unsplash.com/photo-1657228765405-9017239cd421?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8SmFpc2FsbWVyJTIwRGVzZXJ0JTIwU2FmYXJpJTIwJTI2JTIwQ2FtcGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=900',
    duration: 'Overnight',
    includedItems: ['Camel safari', 'Luxury camping', 'Folk music', 'Bonfire', 'All meals'],
    maxGroupSize: 15,
    slots: generateSlots(3499),
  },
  {
    title: 'Darjeeling Sunrise & Tea Estate',
    description: 'Spectacular sunrise from Tiger Hill, UNESCO toy train ride, tea estate tour, and local market exploration.',
    location: 'Darjeeling, West Bengal',
    category: 'trail',
    basePrice: 1899,
    image: 'https://images.unsplash.com/photo-1712175847805-8010d80e050a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGFyamVlbGluZyUyMHN1bnJpc2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=900',
    duration: '6 hours',
    includedItems: ['Sunrise viewing', 'Toy train', 'Tea estate', 'Breakfast', 'Guide'],
    maxGroupSize: 12,
    slots: generateSlots(1899),
  },
  {
    title: 'Sunderbans Mangrove Forest Safari',
    description: 'Boat safari in world\'s largest mangrove forest, spot Royal Bengal Tigers, crocodiles, and exotic birds.',
    location: 'Sunderbans, West Bengal',
    category: 'cruise',
    basePrice: 3999,
    image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800',
    duration: 'Full day',
    includedItems: ['Boat safari', 'Expert guide', 'All meals', 'Binoculars', 'Wildlife spotting'],
    maxGroupSize: 16,
    slots: generateSlots(3999),
  },
  {
    title: 'Mumbai Dharavi Slum Tour',
    description: 'Ethical slum tourism showing recycling units, small-scale industries, and community resilience with local guides.',
    location: 'Mumbai, Maharashtra',
    category: 'trail',
    basePrice: 899,
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800',
    duration: '3 hours',
    includedItems: ['Local guide', 'Community donation', 'Refreshments', 'Photography permission'],
    maxGroupSize: 8,
    slots: generateSlots(899),
  },
  {
    title: 'Lonavala Monsoon Waterfall Rappelling',
    description: 'Adrenaline-pumping rappelling beside roaring monsoon waterfalls with professional equipment and instructors.',
    location: 'Lonavala, Maharashtra',
    category: 'adventure',
    basePrice: 2199,
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800',
    duration: '3 hours',
    includedItems: ['Safety gear', 'Professional instructors', 'Equipment', 'Photos', 'Certificate'],
    maxGroupSize: 6,
    slots: generateSlots(2199),
  },
  {
    title: 'Andaman Scuba Diving Adventure',
    description: 'Discover vibrant coral reefs and marine life with PADI certified instructors. Underwater photography included.',
    location: 'Havelock Island, Andaman',
    category: 'adventure',
    basePrice: 4999,
    image: 'https://images.unsplash.com/photo-1738170207125-b3076f2cfb2b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fEFuZGFtYW4lMjBTY3ViYSUyMERpdmluZyUyMEFkdmVudHVyZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=900',
    duration: '4 hours',
    includedItems: ['Scuba equipment', 'PADI instructor', 'Underwater photos', 'Transport', 'Certificate'],
    maxGroupSize: 8,
    slots: generateSlots(4999),
  },
  {
    title: 'Kovalam Lighthouse Beach Experience',
    description: 'Relax at famous Kovalam beach, lighthouse visit, traditional Kerala massage, and seafood dinner by the shore.',
    location: 'Kovalam, Kerala',
    category: 'beach',
    basePrice: 1799,
    image: 'https://plus.unsplash.com/premium_photo-1754269402908-b17a5d737258?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8S292YWxhbSUyMExpZ2h0aG91c2UlMjBCZWFjaCUyMEV4cGVyaWVuY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=900',
    duration: '4 hours',
    includedItems: ['Beach access', 'Lighthouse entry', 'Ayurvedic massage', 'Seafood dinner', 'Sunset viewing'],
    maxGroupSize: 10,
    slots: generateSlots(1799),
  }
];

// Your promo codes data (copied from seed.ts)
const promoCodesData = [
  {
    code: 'WELCOME20',
    discountType: 'percentage' as const,
    discountValue: 20,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    isActive: true,
    minOrderValue: 1000,
    maxDiscount: 500,
    usageLimit: 1000,
    firstTimeUserOnly: true,
  },
  {
    code: 'SUMMER25',
    discountType: 'percentage' as const,
    discountValue: 25,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    isActive: true,
    minOrderValue: 2000,
    maxDiscount: 1000,
    usageLimit: 500,
    firstTimeUserOnly: false,
  },
  {
    code: 'ADVENTURE30',
    discountType: 'percentage' as const,
    discountValue: 30,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    isActive: true,
    minOrderValue: 3000,
    applicableCategories: ['adventure', 'trekking'],
    firstTimeUserOnly: false,
  },
  {
    code: 'BEACH15',
    discountType: 'percentage' as const,
    discountValue: 15,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true,
    minOrderValue: 1500,
    applicableCategories: ['beach', 'cruise'],
    firstTimeUserOnly: false,
  },
  {
    code: 'FLAT500',
    discountType: 'flat' as const,
    discountValue: 500,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    isActive: true,
    minOrderValue: 3000,
    usageLimit: 200,
    firstTimeUserOnly: false,
  },
];

router.post('/seed', async (req, res) => {
  try {
    const { secret } = req.body;
    
    // Simple security check
    if (secret !== SEED_SECRET) {
      return res.status(401).json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Invalid seed secret' 
      });
    }

    console.log('🌱 Starting production database seeding...');

    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await Experience.deleteMany({});
    await PromoCode.deleteMany({});

    // Insert experiences
    console.log('📝 Inserting experiences...');
    const experiences = await Experience.insertMany(experiencesData);
    console.log(`✅ Inserted ${experiences.length} experiences`);

    // Insert promo codes
    console.log('🎟️ Inserting promo codes...');
    const promoCodes = await PromoCode.insertMany(promoCodesData);
    console.log(`✅ Inserted ${promoCodes.length} promo codes`);

    res.json({
      success: true,
      message: 'Database seeded successfully!',
      data: {
        experiences: experiences.length,
        promoCodes: promoCodes.length
      }
    });

  } catch (error: any) {
    console.error('❌ Seeding failed:', error);
    res.status(500).json({
      success: false,
      error: 'Seeding failed',
      message: error.message
    });
  }
});

// Health check for seed routes
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Seed routes are working',
    timestamp: new Date().toISOString()
  });
});

export default router;