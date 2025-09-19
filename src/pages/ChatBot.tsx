@@ .. @@
 import { Send, Bot, User, Sparkles } from 'lucide-react';
 import { ChatMessage } from '../types/venue';
-import { getAllVenues } from '../data/venues';
+import { searchVenues } from '../utils/venues';
 import VenueCard from './VenueCard';