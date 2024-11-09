const stories = [
    // Round 1 Story
    [
        "Captain Rex: \"This is Rex, reporting in from sector 7G. All systems are nominal.\"",
        "Space Command: \"Copy that, Captain. Any sign of the fugitives?\"",
        "Captain Rex: \"Not yet. They've gone quiet since entering this region.\"",
        "Space Command: \"Be advised, you're approaching uncharted territory.\"",
        "Captain Rex: \"Understood. The star density is increasing. Proceeding with caution.\"",
        "Space Command: \"Our sensors indicate possible asteroid fields ahead.\"",
        "Captain Rex: \"Affirmative. I'm starting to pick up asteroids on the radar.\"",
        "Space Command: \"Maintain vigilance. The fugitives might be hiding out there.\"",
        "Captain Rex: \"Will do. Nothing untoward so far, but I'll stay sharp.\"",
        "Space Command: \"We're counting on you, Captain. Begin your sweep when ready.\""
    ],
    // Round 2 Story
    [
        "Captain Rex: \"Space Command, do you read? I'm noticing unusual readings.\"",
        "Space Command: \"...tain...x... signal...weak...\"",
        "Captain Rex: \"Repeat that, Command. You're breaking up.\"",
        "Static fills the channel, and Rex hears faint, distorted voices.",
        "Captain Rex: \"Something's not right here. Systems are acting up.\"",
        "He checks his instruments, which flicker erratically.",
        "Captain Rex: \"Is anyone there? Respond!\"",
        "The only reply is garbled noise and intermittent silence.",
        "A sense of unease settles in as the asteroid field grows denser.",
        "Captain Rex grips the controls tighter: \"I have a bad feeling about this...\""
    ],
    // Round 3 Story
    [
        "Captain Rex: \"Enemy ships detected! They're engaging our position.\"",
        "Space Command: \"Understood, Captain. Engage them with all available weapons.\"",
        "Captain Rex: \"Firing lasers! Taking heavy fire in return.\"",
        "Space Command: \"Be cautious, Rex. They seem organized and relentless.\"",
        "Captain Rex: \"Affirmative. Maneuvering to evade incoming fire.\"",
        "Enemy ships are closing in, attempting to outflank our position.",
        "Captain Rex: \"They're forming a pincer move. Need to break their formation.\"",
        "Space Command: \"Use the asteroid fields as cover. It might give you the advantage.\"",
        "Captain Rex: \"Good idea. Diving into the nearest asteroid to hide my movements.\"",
        "Space Command: \"Stay sharp, Captain. The enemy isn't giving up easily.\""
    ],
    // Round 4 Story
    [
        "Captain Rex: \"Some of these asteroids are housing enemy weapons outposts.\"",
        "Space Command: \"Be careful, Rex. Those outposts are heavily fortified.\"",
        "Captain Rex: \"Engaging the outpost's defenses. It's more challenging than anticipated.\"",
        "Space Command: \"Deploy additional firepower if you can. We can't let them bolster their arsenal.\"",
        "Captain Rex: \"Understood. Launching missiles towards the enemy outpost.\"",
        "The outpost retaliates with concentrated energy blasts.",
        "Captain Rex: \"Taking heavy fire. Shields are holding for now.\"",
        "Space Command: \"Maintain your assault, Captain. We need to cripple their operations.\"",
        "Captain Rex: \"Shields are holding, but the hull integrity is compromised.\"",
        "Space Command: \"Proceed with caution. Your safety is our priority.\""
    ],
    // Round 5 Story
    [
        "Captain Rex: \"Taking heavy fire from enemy reinforcements. There are almost too many.\"",
        "Space Command: \"Rex, hold your ground. We are dispatching additional support.\"",
        "Captain Rex: \"Enemy numbers are overwhelming. Our defenses are stretched thin.\"",
        "Space Command: \"Maintain your position. Reinforcements should arrive shortly.\"",
        "Captain Rex: \"Enemy ships are relentless. It's like they're anticipating our every move.\"",
        "Space Command: \"They must have intelligence on our patrol routes. Stay alert.\"",
        "Captain Rex: \"Using evasive maneuvers to confuse the enemy. It's only buying us time.\"",
        "Space Command: \"Reinforcements are en route. Hold out as long as you can.\"",
        "Captain Rex: \"Understood. Preparing for a coordinated defense.\"",
        "Space Command: \"Good luck, Captain. We're all counting on you.\""
    ],
    // Round 6 Story
    [
        "Captain Rex: \"The enemy is well-prepared. Their tactics are superior to ours.\"",
        "Space Command: \"Adjust your strategy, Rex. Adapt to their movements.\"",
        "Captain Rex: \"Affirmative. Changing formation to counter their assault.\"",
        "Enemy ships are deploying advanced weaponry and coordinated attacks.",
        "Captain Rex: \"Their flagship has appeared. It’s directing their forces.\"",
        "Space Command: \"Focus your fire on the flagship. Neutralizing it could disorient the enemy.\"",
        "Captain Rex: \"Targeting the flagship now. Preparing to launch heavy ordnance.\"",
        "The flagship retaliates with a devastating energy beam.",
        "Captain Rex: \"Incoming beam! Evading at maximum speed.\"",
        "Space Command: \"Hold steady, Captain. Aim for the flagship's weak points.\""
    ],
    // Round 7 Story
    [
        "Captain Rex: \"What the hell was that? It was some sort of translucent goo? Glowing bright green and destroying everything it touches.\"",
        "Space Command: \"Unknown substance detected. It appears to be a form of energy-based weapon.\"",
        "Captain Rex: \"It's spreading rapidly, compromising our systems and hull integrity.\"",
        "Space Command: \"Attempt to contain the spread. Use your shield generators to create barriers.\"",
        "Captain Rex: \"Shields are fluctuating. The goo is disrupting our systems.\"",
        "Space Command: \"Deploy anti-viral protocols to purge the contamination.\"",
        "Captain Rex: \"Engaging protocols now. The goo is resisting our containment efforts.\"",
        "Space Command: \"Fallback to emergency protocols. We need to stabilize the ship.\"",
        "Captain Rex: \"Stabilizing ship's core. The contamination is slowing down.\"",
        "Space Command: \"Good work, Captain. Continue to monitor for any further anomalies.\""
    ],
    // Round 8 Story
    [
        "Captain Rex: \"Something is happening. Where are all these asteroids coming from?\"",
        "Space Command: \"Analyzing data... It appears to be a coordinated deployment from multiple sectors.\"",
        "Captain Rex: \"This is unprecedented. The asteroid density is off the charts.\"",
        "Space Command: \"Rex, it seems the enemy is using advanced technology to manipulate the asteroid fields.\"",
        "Captain Rex: \"If they control the asteroids, they can ambush us at any point.\"",
        "Space Command: \"We need to disrupt their control mechanisms. Focus on disabling their satellites.\"",
        "Captain Rex: \"Understood. Scanning for satellite installations within the asteroid clusters.\"",
        "Space Command: \"Proceed with caution. These installations are likely heavily guarded.\"",
        "Captain Rex: \"Engaging enemy satellites. It’s a tough battle, but we must persevere.\"",
        "Space Command: \"Stay focused, Captain. The fate of the sector depends on your success.\""
    ],
    // Round 9 Story
    [
        "Captain Rex: \"Space Command, what's going on? Has something happened? There are too many asteroids.\"",
        "Space Command: \"Affirmative, Rex. We're detecting multiple large-scale disruptions across sectors.\"",
        "Captain Rex: \"It’s like a cosmic storm. The asteroids are accelerating towards our position.\"",
        "Space Command: \"Rex, initiate emergency protocols. We need to find a safe passage out of the asteroid belt.\"",
        "Captain Rex: \"I'm trying to map a path, but the debris is too dense. It's impeding our navigation systems.\"",
        "Space Command: \"Divert power to the navigation thrusters. We might be able to create a temporary corridor.\"",
        "Captain Rex: \"Diverting power now. Attempting to create a pathway through the debris.\"",
        "Space Command: \"Be cautious. The debris fields are unstable and unpredictable.\"",
        "Captain Rex: \"Pathway is partially clear, but the engines are struggling against the debris.\"",
        "Space Command: \"Maintain your course, Captain. Reinforcements are being deployed to assist you.\""
    ],
    // Round 10 Story
    [
        "Captain Rex: \"I can't find a path out. Where did all this debris come from? Space Command, I'm not gonna make it.\"",
        "Space Command: \"Rex, hold on! We're deploying a rescue team immediately.\"",
        "Captain Rex: \"The ship's integrity is failing. The debris is tearing us apart.\"",
        "Space Command: \"Initiate self-destruct protocols to prevent enemy capture.\"",
        "Captain Rex: \"Understood. Preparing to self-destruct.\"",
        "The ship starts to power down, systems failing one by one.",
        "Captain Rex: \"It's been an honor serving with you, Command. Take care of our sector.\"",
        "Space Command: \"Rex, stay strong! We're on our way to extract you.\"",
        "Captain Rex: \"There's too much debris. I don't see any escape routes.\"",
        "Space Command: \"Rex, don't give up! Reinforcements are almost here. Hang in there!\""
    ]
];
