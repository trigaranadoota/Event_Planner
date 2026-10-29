import { EventPlan } from '../types';

export const INITIAL_EVENTS: EventPlan[] = [
  {
    id: 'event-wedding-cotswold',
    eventType: 'wedding',
    title: 'The Cotswold Manor Nuptials',
    tagline: 'An intimate heirloom union steeped in quiet English elegance, candlelit courtyards, and aged stone.',
    vibe: 'Old-money heritage, warm alabaster linen, unlacquered brass, garden roses & wild thyme',
    location: 'Highgrove Valley Manor, Gloucestershire',
    date: '2027-06-19',
    guestCount: 110,
    targetBudget: 58000,
    currency: '$',
    palette: [
      { name: 'Warm Alabaster', hex: '#FAF7F2', role: 'Foundation Canvas' },
      { name: 'Belgian Linen', hex: '#EBE3D5', role: 'Drapery & Tables' },
      { name: 'Burnished Brass', hex: '#A89260', role: 'Candlesticks & Flatware' },
      { name: 'Cotswold Sage', hex: '#727D6B', role: 'Foliage & Florals' },
      { name: 'Charcoal Slate', hex: '#242220', role: 'Calligraphy Ink' },
    ],
    budgetItems: [
      { id: 'b1', category: 'Venue & Facilities', name: 'Manor Estate 3-Day Exclusive Hire', allocated: 16500, actual: 16500, status: 'deposit_paid', assignedTo: 'Eleanor Vance', notes: 'Includes grand hall, walled garden, and 8 guest suites' },
      { id: 'b2', category: 'Catering & Fine Wines', name: 'Farm-to-Table 4-Course Tasting & Cellar Pairing', allocated: 17200, actual: 16800, status: 'deposit_paid', assignedTo: 'Arthur Pendelton', notes: 'Sommelier curated pairing with local artisanal cheeses' },
      { id: 'b3', category: 'Floral & Botanical Design', name: 'Botanical Courtyard Arch & Tallow Candle Scapes', allocated: 8200, actual: 7900, status: 'deposit_paid', assignedTo: 'Julian Croft', notes: 'Unstructured garden roses, olive branches, and trailing jasmine' },
      { id: 'b4', category: 'Photography & Film', name: 'Medium Format Film & 35mm Archival Coverage', allocated: 6200, actual: 6200, status: 'deposit_paid', assignedTo: 'Eleanor Vance', notes: 'Full day coverage with second shooter and linen-bound proof book' },
      { id: 'b5', category: 'Music & Entertainment', name: 'St. James Chamber Strings & Evening Jazz Trio', allocated: 4200, actual: 3900, status: 'unpaid', assignedTo: 'Julian Croft', notes: 'Acoustic Bach & Debussy for ceremony, jazz standards for reception' },
      { id: 'b6', category: 'Stationery & Calligraphy', name: 'Handmade Deckled Cotton Suites & Wax Crests', allocated: 2100, actual: 2200, status: 'paid', assignedTo: 'Eleanor Vance', notes: 'Inscribed with slate pigment on 600gsm cotton rag' },
      { id: 'b7', category: 'Attire & Styling', name: 'Bespoke Tailoring & Silk Tulle Veil Curation', allocated: 2400, actual: 2150, status: 'paid', assignedTo: 'Eleanor Vance', notes: 'Savile Row morning coat alterations and vintage hair combs' },
      { id: 'b8', category: 'Contingency Reserve', name: 'Inclement Weather Covered Pavilion Provision', allocated: 1200, actual: 0, status: 'unpaid', assignedTo: 'Eleanor Vance', notes: 'Held in reserve for covered courtyard heaters if frost occurs' },
    ],
    timeline: [
      { id: 't1', timeframe: '6 Months Out', title: 'Estate Tasting & Wine Selection', description: 'Sample summer harvest courses with executive chef Marcus and finalize cellar selections.', phase: 'milestone', completed: true, assignedTo: 'Eleanor Vance' },
      { id: 't2', timeframe: '3 Months Out', title: 'Dispatch Hand-Penned Invitations', description: 'Mail wax-sealed invitation suites with return RSVP cards and bespoke wax seals.', phase: 'milestone', completed: true, assignedTo: 'Julian Croft' },
      { id: 't3', timeframe: '1 Month Out', title: 'Final Floral Mockup & Acoustic Run-Through', description: 'Inspect tablescape urns in natural light and confirm string trio prelude order.', phase: 'milestone', completed: false, assignedTo: 'Julian Croft' },
      { id: 't4', timeframe: '1 Week Out', title: 'Rehearsal Supper in the Orangery', description: 'Intimate dinner for close family, contributors, and wedding party with champagne.', phase: 'milestone', completed: false, assignedTo: 'Arthur Pendelton' },
      { id: 'td1', timeframe: 'Day Of', time: '09:00 AM', title: 'Vendor Load-In & Botanical Staging', description: 'Florists arrive to construct courtyard arch; table linens pressed and laid.', phase: 'day_of', completed: false, assignedTo: 'Julian Croft', location: 'Courtyard & Great Hall' },
      { id: 'td2', timeframe: 'Day Of', time: '01:30 PM', title: 'Private First Look & Conservatory Portraits', description: 'Editorial film portraits captured in soft daylight within the glass conservatory.', phase: 'day_of', completed: false, assignedTo: 'Eleanor Vance', location: 'Conservatory' },
      { id: 'td3', timeframe: 'Day Of', time: '03:45 PM', title: 'Guest Arrival & Chilled Herbal Aperitifs', description: 'White port tonics and lavender shortbread served as chamber strings play.', phase: 'day_of', completed: false, assignedTo: 'Arthur Pendelton', location: 'Lower Terrace' },
      { id: 'td4', timeframe: 'Day Of', time: '04:30 PM', title: 'The Ceremony in the Walled Garden', description: 'Vows exchanged beneath ancient limestone arch with Bach Cello Suite No. 1.', phase: 'day_of', completed: false, assignedTo: 'Eleanor Vance', location: 'Walled Garden' },
      { id: 'td5', timeframe: 'Day Of', time: '05:30 PM', title: 'Sunset Courtyard Cocktails & Oysters', description: 'Freshly shucked oysters, passed canapés, and bespoke Rosemary French 75s.', phase: 'day_of', completed: false, assignedTo: 'Julian Croft', location: 'Stone Courtyard' },
      { id: 'td6', timeframe: 'Day Of', time: '07:00 PM', title: 'Candlelit Banquet & Heartfelt Toasts', description: 'Seated four-course harvest feast followed by family toasts and vintage champagne.', phase: 'day_of', completed: false, assignedTo: 'All', location: 'The Great Hall' },
      { id: 'td7', timeframe: 'Day Of', time: '09:30 PM', title: 'Late Evening Salon & Jazz Quintet', description: 'Dark chocolate gateau, espresso service, digestifs, and courtyard dancing.', phase: 'day_of', completed: false, assignedTo: 'Arthur Pendelton', location: 'Ballroom & Terrace' },
    ],
    vendors: [
      {
        id: 'v1',
        category: 'Venue',
        name: 'Highgrove Valley Manor',
        contactName: 'Lady Beatrice Howard',
        contactEmail: 'events@highgrovevalleymanor.co.uk',
        contactPhone: '+44 1666 823900',
        status: 'contract_signed',
        fee: 16500,
        depositDue: 'Paid (50% Deposit Confirmed)',
        questions: ['Noise curfew strictly at midnight?', 'Confetti restrictions on stone terrace?'],
        notes: 'Includes early access on Thursday afternoon for staging.',
        website: 'https://highgrovevalleymanor.example'
      },
      {
        id: 'v2',
        category: 'Catering',
        name: 'The Cotswold Culinary Atelier',
        contactName: 'Chef Henri Moreau',
        contactEmail: 'henri@cotswoldatelier.com',
        contactPhone: '+44 1666 431289',
        status: 'contract_signed',
        fee: 17200,
        depositDue: 'Final payment due 14 days prior',
        questions: ['Gluten-free alternatives for second course?', 'Canapé service timing for 110 guests?'],
        notes: 'Providing English bone china, silver-plated cutlery, and crystal stemware.',
      },
      {
        id: 'v3',
        category: 'Florist',
        name: 'Hedgerow & Heritage Botanicals',
        contactName: 'Penelope Thorne',
        contactEmail: 'penelope@hedgerowheritage.com',
        contactPhone: '+44 1453 790112',
        status: 'contract_signed',
        fee: 8200,
        depositDue: 'Balance due 30 days prior',
        questions: ['Availability of locally harvested cream garden roses?', 'Rental of antique stone urns?'],
        notes: 'Includes 120 tallow taper candles and glass storm shades for outdoors.',
      },
      {
        id: 'v4',
        category: 'Photographer',
        name: 'Clara Sterling Archival Photography',
        contactName: 'Clara Sterling',
        contactEmail: 'clara@sterlingphotography.co.uk',
        status: 'contract_signed',
        fee: 6200,
        depositDue: 'Full retainer settled',
        questions: ['Film stocks: Kodak Portra 400 + Ilford HP5 for evening black and white?'],
        notes: 'Includes 10 hours continuous coverage and archival proof box.',
      },
      {
        id: 'v5',
        category: 'Music',
        name: 'St. James Chamber Strings & Jazz',
        contactName: 'David Alistair',
        contactEmail: 'stjamesensembles@gmail.com',
        status: 'quoted',
        fee: 4200,
        depositDue: 'Deposit pending signature',
        questions: ['Ability to arrange custom accompaniment for bridal processional?'],
        notes: 'Quote includes 2 hours quartet for ceremony + 3 hours jazz trio for dinner.',
      }
    ],
    personalizedIdeas: {
      signatureDrinks: [
        { name: 'The Highgrove French 75', ingredients: 'Cotswolds Botanical Gin, Blanc de Blancs Champagne, fresh lemon, garden lavender syrup', story: 'Effervescent and fragrant, honoring the manor lavender gardens.' },
        { name: 'Old Library Smoked Manhattan', ingredients: 'Small-batch Rye, Carpano Antica Vermouth, Angostura, cherrywood smoke', story: 'Served in cut-crystal tumblers by the stone fireplace during cocktail hour.' }
      ],
      invitationWording: 'Together with their families, Eleanor Vance and Arthur Pendelton request the honour of your presence at their wedding celebration. Join us for an evening of quiet vows, shared harvest, and music under the Cotswold stars.',
      acousticPlaylist: [
        'Maxence Cyrin - Where Is My Mind (Classical Piano)',
        'The St. James Quartet - Bach: Cello Suite No. 1 in G Major',
        'Bill Evans Trio - My Romance',
        'Chet Baker - I Fall In Love Too Easily',
        'Stan Getz & João Gilberto - Desafinado'
      ],
      guestFavors: 'Individually wrapped hand-poured wild thyme and beeswax taper candles paired with personalized letterpress matchboxes.'
    },
    contributors: [
      { id: 'c1', name: 'Eleanor Vance', email: 'eleanor.vance@atelier.com', role: 'host', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', isOnline: true, assignedTasksCount: 4 },
      { id: 'c2', name: 'Julian Croft', email: 'julian.croft@atelier.com', role: 'co_planner', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', isOnline: true, assignedTasksCount: 3 },
      { id: 'c3', name: 'Arthur Pendelton', email: 'arthur.p@atelier.com', role: 'host', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', isOnline: false, assignedTasksCount: 2 },
      { id: 'c4', name: 'Clara Montgomery', email: 'clara.m@family.com', role: 'contributor', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', isOnline: true, assignedTasksCount: 1 },
      { id: 'c5', name: 'Marcus Sterling', email: 'marcus@somerset.org', role: 'guest', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80', isOnline: false, assignedTasksCount: 0 },
    ],
    contributorTasks: [
      { id: 'ct1', title: 'Bring Heirloom Silver Cake Knife', category: 'Heirlooms', assignedToName: 'Clara Montgomery', status: 'claimed', dueDate: '2026-09-17', notes: 'Polished family heirloom knife from 1922.' },
      { id: 'ct2', title: 'Coordinate Guest Shuttle Timing', category: 'Logistics', assignedToName: 'Julian Croft', status: 'completed', dueDate: '2026-09-10', notes: 'Vintage Leyland bus booked for hotel pick-up at 3:15 PM.' },
      { id: 'ct3', title: 'Confirm Sommelier Reserve Crates', category: 'Cellar', assignedToName: 'Arthur Pendelton', status: 'claimed', dueDate: '2026-09-12', notes: '6 cases of 2018 Meursault delivered to cellar.' },
      { id: 'ct4', title: 'Welcome Table Guest Book Stationery', category: 'Reception', assignedToName: undefined, status: 'open', dueDate: '2026-09-15', notes: 'Ensure fountain pens and blotter linen are in place.' },
    ],
    activityLog: [
      { id: 'a1', user: 'Julian Croft', action: 'Approved Floral design contract with Hedgerow & Heritage', timestamp: '12 mins ago', type: 'vendor' },
      { id: 'a2', user: 'Eleanor Vance', action: 'Adjusted Day-of schedule: First Look moved to 01:30 PM', timestamp: '45 mins ago', type: 'timeline' },
      { id: 'a3', user: 'Clara Montgomery', action: 'Claimed task: "Bring Heirloom Silver Cake Knife"', timestamp: '2 hours ago', type: 'task' },
      { id: 'a4', user: 'Arthur Pendelton', action: 'Updated Catering budget actuals after cellar review', timestamp: 'Yesterday', type: 'budget' },
    ],
    discussionNotes: [
      { id: 'd1', author: 'Eleanor Vance', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', role: 'Host', content: 'Chef Henri confirmed that the late-harvest fig tart can be served with warm honeycomb from the estate apiary. Pure perfection!', timestamp: 'Today at 09:14 AM' },
      { id: 'd2', author: 'Julian Croft', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', role: 'Co-planner', content: 'I had the string quartet preview the tempo for the Bach prelude. It will sync seamlessly with the garden gate processional.', timestamp: 'Yesterday at 04:30 PM' },
    ]
  },
  {
    id: 'event-birthday-vineyard',
    eventType: 'birthday',
    title: "Julian's 40th Heritage Cellar Soirée",
    tagline: 'A milestone birthday honoring camaraderie, rare vintages, and candlelit long-table dining.',
    vibe: 'Old-money salon, deep walnut, amber candlelight, library leather & heavy linen',
    location: 'Meadowood Wine Cellars & Oak Pavilion, Napa Valley',
    date: '2026-11-14',
    guestCount: 45,
    targetBudget: 19500,
    currency: '$',
    palette: [
      { name: 'Aged Parchment', hex: '#F5EFE6', role: 'Stationery Background' },
      { name: 'Walnut Amber', hex: '#6D4C3D', role: 'Tables & Barrels' },
      { name: 'Oxblood Reserve', hex: '#5E1914', role: 'Vintage Wine Accent' },
      { name: 'Burnished Gold', hex: '#B89758', role: 'Candelabras' },
      { name: 'Espresso Slate', hex: '#1C1917', role: 'Typography & Suits' },
    ],
    budgetItems: [
      { id: 'bb1', category: 'Venue & Facilities', name: 'Private Historic Stone Cellar & Barrel Room', allocated: 5500, actual: 5500, status: 'paid', assignedTo: 'Julian Croft', notes: 'Complete privacy with antique oak long table' },
      { id: 'bb2', category: 'Catering & Fine Wines', name: 'Library Vintage Pairing & Wood-Fired Feast', allocated: 7800, actual: 7600, status: 'deposit_paid', assignedTo: 'Julian Croft', notes: 'Dry-aged prime rib, truffle polenta, and 2012 reserve vertical' },
      { id: 'bb3', category: 'Floral & Botanical Design', name: 'Potted Olive Trees & Olive Branch Runners', allocated: 1800, actual: 1650, status: 'deposit_paid', assignedTo: 'Clara Montgomery', notes: 'Low profile foliage to encourage cross-table conversation' },
      { id: 'bb4', category: 'Photography & Film', name: 'Intimate Editorial Film Coverage (4 Hours)', allocated: 2200, actual: 2200, status: 'deposit_paid', assignedTo: 'Julian Croft', notes: 'Focus on candid laughter and table speeches' },
      { id: 'bb5', category: 'Music & Entertainment', name: 'Acoustic Spanish Guitar & Vinyl DJ Set', allocated: 1400, actual: 1400, status: 'unpaid', assignedTo: 'Marcus Sterling', notes: 'Flamenco acoustic during dinner, vintage soul vinyl afterwards' },
      { id: 'bb6', category: 'Stationery & Calligraphy', name: 'Monogrammed Leather Menu Booklets', allocated: 800, actual: 750, status: 'paid', assignedTo: 'Eleanor Vance', notes: 'Embossed blind monogram on vegetable-tanned leather' },
    ],
    timeline: [
      { id: 'tb1', timeframe: '2 Months Out', title: 'Cellar Vertical Wine Allocation', description: 'Reserve rare library vintages with the head winemaker.', phase: 'milestone', completed: true, assignedTo: 'Julian Croft' },
      { id: 'tb2', timeframe: '3 Weeks Out', title: 'Finalize Monogrammed Menus', description: 'Review calligraphy proofs for guest personalized place cards.', phase: 'milestone', completed: false, assignedTo: 'Eleanor Vance' },
      { id: 'tbd1', timeframe: 'Day Of', time: '04:00 PM', title: 'Cellar Temperature & Candle Lighting', description: 'Light 80 pillar candles in stone sconces; decant older vintage magnums.', phase: 'day_of', completed: false, assignedTo: 'Julian Croft', location: 'Stone Cellar' },
      { id: 'tbd2', timeframe: 'Day Of', time: '05:30 PM', title: 'Welcome Aperitif in Olive Grove', description: 'Spanish vermut, marcona almonds, and acoustic guitar greeting.', phase: 'day_of', completed: false, assignedTo: 'Marcus Sterling', location: 'Upper Grove' },
      { id: 'tbd3', timeframe: 'Day Of', time: '07:00 PM', title: 'Long-Table Cellar Feast & Speeches', description: 'Heirloom family-style service down the 40-foot oak table.', phase: 'day_of', completed: false, assignedTo: 'All', location: 'Barrel Room' },
      { id: 'tbd4', timeframe: 'Day Of', time: '09:45 PM', title: 'Single Malt Scotch & Vinyl Lounge', description: 'Cigar terrace opening with rare Islay malts and analog vinyl records.', phase: 'day_of', completed: false, assignedTo: 'Julian Croft', location: 'Cigar Terrace' },
    ],
    vendors: [
      { id: 'vb1', category: 'Venue', name: 'Meadowood Reserve Cellars', contactName: 'Thomas Sterling', contactEmail: 't.sterling@meadowoodcellars.com', status: 'contract_signed', fee: 5500, depositDue: 'Paid in Full', questions: ['Open flame permit for terrace?'], notes: 'Includes estate sommelier on site for duration.' },
      { id: 'vb2', category: 'Catering', name: 'Heritage Wood & Fire Kitchen', contactName: 'Chef Andrea Ross', contactEmail: 'andrea@heritagekitchen.com', status: 'contract_signed', fee: 7800, depositDue: 'Balance due 1 week prior', questions: ['Vegetarian substitute for 3 guests?'], notes: 'Prepared over local white oak coals.' },
    ],
    personalizedIdeas: {
      signatureDrinks: [
        { name: 'The 1986 Cask Old Fashioned', ingredients: 'Single barrel bourbon, demerara reduction, orange oils, charred cedar bitter mist', story: 'A nod to Julian’s birth year with vintage balance.' },
        { name: 'Torched Rosemary Boulevardier', ingredients: 'Rye whiskey, Campari, sweet vermouth, smoked rosemary spear', story: 'Rich, warming aperitif suited for cool vineyard evenings.' }
      ],
      invitationWording: 'Please join us in celebrating four decades of life, friendship, and enduring memories. An intimate cellar feast among the barrels with fine wine and good company.',
      acousticPlaylist: [
        'Paco de Lucía - Entre dos aguas (Spanish Guitar)',
        'Otis Redding - That’s How Strong My Love Is',
        'Van Morrison - Astral Weeks',
        'Miles Davis - Blue in Green'
      ],
      guestFavors: 'Custom leather luggage tags stamped with guest initials and an estate olive oil bottle.'
    },
    contributors: [
      { id: 'c2', name: 'Julian Croft', email: 'julian.croft@atelier.com', role: 'host', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', isOnline: true, assignedTasksCount: 4 },
      { id: 'c1', name: 'Eleanor Vance', email: 'eleanor.vance@atelier.com', role: 'co_planner', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', isOnline: true, assignedTasksCount: 2 },
      { id: 'c5', name: 'Marcus Sterling', email: 'marcus@somerset.org', role: 'contributor', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80', isOnline: true, assignedTasksCount: 1 },
    ],
    contributorTasks: [
      { id: 'ctb1', title: 'Bring Vintage Vinyl Collection (Soul & Jazz)', category: 'Music', assignedToName: 'Marcus Sterling', status: 'claimed', dueDate: '2026-11-13', notes: 'Curate 25 select 1960s-1970s LPs for turntable.' },
      { id: 'ctb2', title: 'Hand-Calligraph Place Cards with Seating', category: 'Stationery', assignedToName: 'Eleanor Vance', status: 'claimed', dueDate: '2026-11-10', notes: 'Written on pressed cotton paper with gold ink.' }
    ],
    activityLog: [
      { id: 'ab1', user: 'Julian Croft', action: 'Finalized library vintage cellar order', timestamp: '3 hours ago', type: 'budget' },
      { id: 'ab2', user: 'Marcus Sterling', action: 'Claimed vinyl selection task', timestamp: '5 hours ago', type: 'task' },
    ],
    discussionNotes: [
      { id: 'db1', author: 'Julian Croft', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', role: 'Host', content: 'The sommelier offered to pull two bottles of 1986 Chateau Margaux from their private vault for the main toast!', timestamp: 'Yesterday at 06:12 PM' }
    ]
  },
  {
    id: 'event-community-gala',
    eventType: 'community',
    title: 'The Somerset Harvest Literary Gala',
    tagline: 'An annual charity banquet & live auction sustaining historic regional libraries and arts fellowships.',
    vibe: 'Victorian library salon, dark mahogany, antique brass lamps, green leather & candle glow',
    location: 'The Old Guildhall & Public Library, Bath',
    date: '2027-04-24',
    guestCount: 160,
    targetBudget: 34000,
    currency: '£',
    palette: [
      { name: 'Antique Parchment', hex: '#FAF6EE', role: 'Program & Tickets' },
      { name: 'British Racing Green', hex: '#21382A', role: 'Velvet Drapes & Badges' },
      { name: 'Polished Brass', hex: '#C4A864', role: 'Desk Lamps & Awards' },
      { name: 'Rich Mahogany', hex: '#4A2A20', role: 'Tables & Podium' },
      { name: 'Heritage Ink', hex: '#1D2124', role: 'Letterpress Ink' },
    ],
    budgetItems: [
      { id: 'bg1', category: 'Venue & Facilities', name: 'Historic Guildhall Great Hall & Atrium Hire', allocated: 9000, actual: 9000, status: 'paid', assignedTo: 'Marcus Sterling', notes: 'Charity trust discounted municipal rate' },
      { id: 'bg2', category: 'Catering & Fine Wines', name: 'Harvest 3-Course Banquet for 160 Guests', allocated: 12500, actual: 12100, status: 'deposit_paid', assignedTo: 'Eleanor Vance', notes: 'Locally grown organic cider, roast duck breast, apple tarte tatin' },
      { id: 'bg3', category: 'Floral & Botanical Design', name: 'Foliage Garlands & Antique Book Centerpieces', allocated: 2800, actual: 2600, status: 'deposit_paid', assignedTo: 'Clara Montgomery', notes: 'Arrangements stacked with vintage hardcovers and autumn leaves' },
      { id: 'bg4', category: 'Music & Entertainment', name: 'Guild Chamber Players & Guest Keynote Speaker', allocated: 3200, actual: 3200, status: 'paid', assignedTo: 'Julian Croft', notes: 'Honorarium for Booker Prize-winning poet keynote' },
      { id: 'bg5', category: 'Stationery & Calligraphy', name: 'Letterpress Auction Catalogues & Gilded Bidding Paddles', allocated: 2500, actual: 2300, status: 'paid', assignedTo: 'Marcus Sterling', notes: 'Bound with dark green linen thread' },
      { id: 'bg6', category: 'Contingency Reserve', name: 'Sound & Audio-Visual Rigging Contingency', allocated: 4000, actual: 1200, status: 'unpaid', assignedTo: 'Marcus Sterling', notes: 'Covers microphone redundancy and livestream setup' },
    ],
    timeline: [
      { id: 'tg1', timeframe: '4 Months Out', title: 'Curate 12 Rare Book Auction Lots', description: 'Acquire donated signed first editions and literary estate treasures.', phase: 'milestone', completed: true, assignedTo: 'Marcus Sterling' },
      { id: 'tg2', timeframe: '1 Month Out', title: 'Publish Hardbound Gala Program', description: 'Finalize sponsor acknowledgments and print 200 gilded copies.', phase: 'milestone', completed: true, assignedTo: 'Marcus Sterling' },
      { id: 'tgd1', timeframe: 'Day Of', time: '11:00 AM', title: 'Auction Lot Display Setup', description: 'Lock rare manuscripts in velvet vitrines under spotlighting.', phase: 'day_of', completed: false, assignedTo: 'Clara Montgomery', location: 'Gallery Mezzanine' },
      { id: 'tgd2', timeframe: 'Day Of', time: '06:00 PM', title: 'Patron Reception & Rare Book Viewing', description: 'Somerset sparkling perry and smoked trout tartlets.', phase: 'day_of', completed: false, assignedTo: 'Marcus Sterling', location: 'Library Rotunda' },
      { id: 'tgd3', timeframe: 'Day Of', time: '07:15 PM', title: 'Keynote Address & Seated Dinner', description: 'Address on preservation of oral histories followed by harvest feast.', phase: 'day_of', completed: false, assignedTo: 'All', location: 'Guildhall' },
      { id: 'tgd4', timeframe: 'Day Of', time: '09:00 PM', title: 'The Grand Charity Auction', description: 'Live gavel bidding on 12 premier literary lots.', phase: 'day_of', completed: false, assignedTo: 'Marcus Sterling', location: 'Main Stage' },
    ],
    vendors: [
      { id: 'vg1', category: 'Venue', name: 'Bath Historic Guildhall Trust', contactName: 'Arthur Hastings', contactEmail: 'hastings@bathguildhall.org', status: 'contract_signed', fee: 9000, depositDue: 'Settled', questions: ['Security protocol for manuscript vitrines?'], notes: 'Keys handed over at 8 AM on event morning.' },
      { id: 'vg2', category: 'Catering', name: 'Avon Harvest Banquets', contactName: 'Chef Fiona Stewart', contactEmail: 'fiona@avonharvest.co.uk', status: 'contract_signed', fee: 12500, depositDue: 'Balance due after event', questions: ['Service timing between keynote and auction?'], notes: 'Provides 24 servers in black-tie aprons.' }
    ],
    personalizedIdeas: {
      signatureDrinks: [
        { name: 'The Antiquarian Hot Toddy & Punch', ingredients: 'Somerset apple cider, dark Demerara rum, cinnamon stick, star anise, lemon clove', story: 'Warm, fragrant welcome drink served from silver samovars.' },
        { name: 'The Ink & Quills Bramble', ingredients: 'London Dry Gin, blackberry liqueur, lemon juice, touch of Earl Grey reduction', story: 'Deep violet shade served over crushed ice.' }
      ],
      invitationWording: 'The Trustees of the Old Guildhall request the pleasure of your company at the Somerset Harvest Literary Gala in support of the Heritage Reading Fellowships. An evening of spoken word, harvest dining, and lively benefaction.',
      acousticPlaylist: [
        'Ralph Vaughan Williams - The Lark Ascending',
        'Edward Elgar - Chanson de Matin',
        'Max Richter - On the Nature of Daylight',
        'Claude Debussy - Clair de Lune'
      ],
      guestFavors: 'Hand-pressed botanical bookmarks with letterpressed quotes and personalized calligraphy ribbon.'
    },
    contributors: [
      { id: 'c5', name: 'Marcus Sterling', email: 'marcus@somerset.org', role: 'host', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80', isOnline: true, assignedTasksCount: 4 },
      { id: 'c1', name: 'Eleanor Vance', email: 'eleanor.vance@atelier.com', role: 'co_planner', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', isOnline: true, assignedTasksCount: 2 },
      { id: 'c4', name: 'Clara Montgomery', email: 'clara.m@family.com', role: 'contributor', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', isOnline: true, assignedTasksCount: 2 },
    ],
    contributorTasks: [
      { id: 'ctg1', title: 'Mount Exhibition Vitrines for Rare First Editions', category: 'Exhibition', assignedToName: 'Clara Montgomery', status: 'claimed', dueDate: '2026-10-23', notes: 'Verify locks and internal museum lighting.' },
      { id: 'ctg2', title: 'Prepare 160 Gilded Bidding Paddles with Numbers', category: 'Auction', assignedToName: 'Eleanor Vance', status: 'claimed', dueDate: '2026-10-22', notes: 'Cross-reference against patron guest list.' },
      { id: 'ctg3', title: 'Stage Donor Welcome Desk and Champagne Flutes', category: 'Hospitality', assignedToName: undefined, status: 'open', dueDate: '2026-10-24', notes: 'Position 4 greeting volunteers at marble foyer.' },
    ],
    activityLog: [
      { id: 'ag1', user: 'Marcus Sterling', action: 'Uploaded finalized 12 auction lot descriptions', timestamp: '1 hour ago', type: 'general' },
      { id: 'ag2', user: 'Eleanor Vance', action: 'Confirmed catering dietary roster with Chef Fiona', timestamp: '4 hours ago', type: 'vendor' },
    ],
    discussionNotes: [
      { id: 'dg1', author: 'Marcus Sterling', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80', role: 'Host', content: 'Lord Danbury just confirmed donation of an original 1813 first edition copy of Pride and Prejudice for Lot #7! This will anchor our charity drive.', timestamp: 'Today at 08:30 AM' }
    ]
  }
];
