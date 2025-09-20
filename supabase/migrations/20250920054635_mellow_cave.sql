/*
  # Add Reviews for Willow Lodge

  1. New Reviews
    - Add 3 specific reviews for Willow Lodge
    - Reviews focus on corporate retreat and conference experiences
    - Include details about forest setting, meeting facilities, and team building

  2. Content Details
    - Mention specific amenities (fireplace, forest views, breakout spaces)
    - Reference corporate retreat experiences and team building
    - Include practical details about location and facilities
*/

-- First, get the Willow Lodge venue ID
DO $$
DECLARE
    willow_lodge_id uuid;
BEGIN
    -- Get Willow Lodge ID
    SELECT id INTO willow_lodge_id 
    FROM venues 
    WHERE name = 'Willow Lodge' 
    LIMIT 1;

    -- Add reviews for Willow Lodge
    IF willow_lodge_id IS NOT NULL THEN
        INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
        (willow_lodge_id, 'Marcus Chen', 5, 'Perfect venue for our annual company retreat! The forest setting created exactly the atmosphere we needed for team building and strategic planning. The main lodge has a beautiful stone fireplace that became our natural gathering spot, and the floor-to-ceiling windows overlooking the forest were inspiring during our brainstorming sessions. The breakout rooms were well-equipped with whiteboards and A/V equipment. Our team loved the outdoor deck for lunch breaks - nothing beats fresh Pacific Northwest air to recharge creativity. The rustic-modern aesthetic struck the perfect balance between professional and relaxed. Highly recommend for corporate retreats!', '2024-03-15 14:20:00'),
        
        (willow_lodge_id, 'Sarah Mitchell', 4, 'Hosted our nonprofit board retreat here and it exceeded expectations. The intimate setting (perfect for our 25-person group) fostered great discussions, and the natural lighting in the main conference room was excellent for our day-long sessions. The kitchen facilities allowed us to cater our own meals, which kept costs reasonable. The forest trails provided a nice break between sessions - several board members commented on how the peaceful environment helped them think more clearly. Only minor issue was cell service can be spotty, but honestly that was a blessing for keeping everyone focused! The rustic charm and modern amenities make this a unique find for smaller corporate groups.', '2024-05-22 16:45:00'),
        
        (willow_lodge_id, 'David Rodriguez', 5, 'Exceptional venue for our tech startup''s quarterly planning session. The lodge''s blend of rustic architecture and modern conference facilities was exactly what we needed. The main meeting space accommodated our 40-person team comfortably, with excellent acoustics and projection capabilities. What really set this apart was the outdoor spaces - we held several sessions on the covered deck, and the forest backdrop made for some of our most creative discussions. The full kitchen was perfect for our catered meals, and having multiple breakout spaces let us split into smaller teams effectively. The peaceful forest setting helped our usually high-energy team slow down and think strategically. Worth every penny for a memorable and productive retreat!', '2024-07-08 11:30:00');

        -- Update venue rating and review count
        UPDATE venues 
        SET rating = (
            SELECT ROUND(AVG(rating)::numeric, 2)
            FROM reviews 
            WHERE venue_id = willow_lodge_id
        ),
        reviews_count = (
            SELECT COUNT(*)
            FROM reviews 
            WHERE venue_id = willow_lodge_id
        )
        WHERE id = willow_lodge_id;
    END IF;
END $$;