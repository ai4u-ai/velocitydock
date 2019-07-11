'use strict';

MetronicApp.controller('VideoTextEditorController', function( AuthService,$rootScope, $scope, API_ENDPOINT,$http, $timeout,$analytics, Idle, deepQLearnService,$cookies,$cookieStore,$sce,videoService,algoService,$modal,annotationService,Quill) {

    $scope.trix = "\n" +
        "\n" +
        "\n" +
        "\n" +
        "\n" +
        " \n" +
        "                          NO COUNTRY FOR OLD MEN\n" +
        "\n" +
        "\n" +
        "\n" +
        "\n" +
        "                               Written by\n" +
        "\n" +
        "                        Joel Coen & Ethan Coen\n" +
        "\n" +
        "\n" +
        "\n" +
        "                          Based on the Novel by\n" +
        "\n" +
        "                             Cormac McCarthy\n" +
        "\n" +
        "\n" +
        "\n" +
        "                       \n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         FADE IN:\n" +
        "\n" +
        "          EXT. MOUNTAINS - NIGHT\n" +
        "\n" +
        "          Snow is falling in a gusting wind. The voice of an old man:\n" +
        "\n" +
        "                          VOICE OVER\n" +
        "          I was sheriff of this county when I\n" +
        "           was twenty-five. Hard to believe.\n" +
        "           Grandfather was a lawman. Father\n" +
        "           too. Me and him was sheriff at the\n" +
        "           same time, him in Plano and me here.\n" +
        "           I think he was pretty proud of that.\n" +
        "           I know I was.\n" +
        "\n" +
        "          EXT. WEST TEXAS LANDSCAPE - DAWN/DAY\n" +
        "\n" +
        "\n" +
        "                         \n" +
        "          We dissolve to another West Texas landscape. Sun is rising.\n" +
        "\n" +
        "                          VOICE OVER\n" +
        "          Some of the old-time sheriffs never\n" +
        "           even wore a gun. A lot of folks find\n" +
        "           that hard to believe. Jim Scarborough\n" +
        "           never carried one. That's the younger\n" +
        "           Jim. Gaston Boykins wouldn't wear\n" +
        "           one. Up in Comanche County.\n" +
        "\n" +
        "          We dissolve through more landscapes, bringing us to full\n" +
        "          day. None of them show people or human habitation.\n" +
        "\n" +
        "                          VOICE OVER\n" +
        "          I always liked to hear about the old-\n" +
        "           timers. Never missed a chance to do\n" +
        "           so. Nigger Hoskins over in Bastrop\n" +
        "           County knowed everbody's phone number\n" +
        "           off by heart. You can't help but\n" +
        "           compare yourself against the old-\n" +
        "           timers. Can't help but wonder how\n" +
        "           they would've operated these times.\n" +
        "           There was this boy I sent to the gas\n" +
        "           chamber at Huntsville here a while\n" +
        "           back. My arrest and my testimony. He\n" +
        "           killed a fourteen-year-old girl.\n" +
        "           Papers said it was a crime of passion\n" +
        "           but he told me there wasn't any\n" +
        "           passion to it.\n" +
        "\n" +
        "          EXT. WEST TEXAS ROAD - DAY\n" +
        "\n" +
        "          The last landscape, hard sunbaked prairie, is surveyed in a\n" +
        "          long slow pan.\n" +
        "\n" +
        "                          2\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          VOICE OVER\n" +
        "          Told me that he'd been planning to\n" +
        "           kill somebody for about as long as\n" +
        "           he could remember. Said that if they\n" +
        "           turned him out he'd do it again.\n" +
        "\n" +
        "          The pan has brought into frame the flashing light bars of a\n" +
        "          police car stopped on the shoulder. A young sheriff's deputy\n" +
        "          is opening the rear door on the far side of the car.\n" +
        "\n" +
        "                          VOICE OVER\n" +
        "          Said he knew he was going to hell.\n" +
        "           Be there in about fifteen minutes. I\n" +
        "           don't know what to make of that. I\n" +
        "           surely don't.\n" +
        "\n" +
        "          Close on a pair of hands manacled behind someone's back. A\n" +
        "          hand enters to take the prisoner by one arm.\n" +
        "\n" +
        "                          VOICE OVER\n" +
        "          The crime you see now, it's hard to\n" +
        "           even take its measure. It's not that\n" +
        "           I'm afraid of it.\n" +
        "\n" +
        "          Back to the shot over the light bars: the deputy, with a\n" +
        "          hand on top of the prisoner's head to help him clear the\n" +
        "          door frame, eases the prisoner into the backseat. All we see\n" +
        "          of the prisoner is his dark hair disappearing into the car.\n" +
        "\n" +
        "                          VOICE OVER\n" +
        "          I always knew you had to be willing\n" +
        "           to die to even do this job -- not to\n" +
        "           be glorious. But I don't want to\n" +
        "           push my chips forward and go out and\n" +
        "           meet something I don't understand.\n" +
        "\n" +
        "          The deputy closes the back door. He opens the front passenger\n" +
        "          door and reaches down for something-apparently heavy-at his\n" +
        "          feet.\n" +
        "\n" +
        "                          VOICE OVER\n" +
        "          You can say it's my job to fight it\n" +
        "           but I don't know what it is anymore.\n" +
        "\n" +
        "          The deputy swings the heavy object into the front passenger\n" +
        "          seat. Matching inside the car: it looks like an oxygen tank\n" +
        "          with a petcock at the top and tubing running off it.\n" +
        "\n" +
        "                          VOICE OVER\n" +
        "          ...More than that, I don't want to\n" +
        "           know. A man would have to put his\n" +
        "           soul at hazard.\n" +
        "          The deputy slams the door.\n" +
        "\n" +
        "                          3\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "          On the door slam we cut to Texas highway racing under the\n" +
        "          lens, the landscape flat to the horizon. The siren whoops.\n" +
        "\n" +
        "                          VOICE OVER\n" +
        "          ...He would have to say, okay, I'll\n" +
        "           be part of this world.\n" +
        "\n" +
        "          INT. SHERIFF LAMAR'S OFFICE - DAY\n" +
        "\n" +
        "\n" +
        "                         THE DEPUTY\n" +
        "         Seated in the sheriff's office, on the phone. The prisoner\n" +
        "          stands in the background. Focus is too soft for us to see\n" +
        "          his features but his posture shows that his arms are still\n" +
        "          behind his back.\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          DEPUTY\n" +
        "          Yessir, just walked in the door.\n" +
        "           Sheriff he had some sort of a thing\n" +
        "           on him like one of them oxygen tanks\n" +
        "           for emphysema or somethin'. And a\n" +
        "           hose from it run down his sleeve...\n" +
        "\n" +
        "          Behind him we see the prisoner seat himself on the floor\n" +
        "          without making a sound and scoot his manacled hands out under\n" +
        "          his legs. Hands in front of him now, he stands.\n" +
        "\n" +
        "                          DEPUTY\n" +
        "          ...Well you got me, sir. You can see\n" +
        "           it when you get in...\n" +
        "          The prisoner approaches. As he nears the deputy's back he\n" +
        "          grows sharper but begins to crop out of the top of the frame.\n" +
        "\n" +
        "                          DEPUTY\n" +
        "          ...Yessir I got it covered.\n" +
        "          As the deputy reaches forward to hang up, the prisoner is\n" +
        "          raising his hands out of frame just behind him. The manacled\n" +
        "          hands drop back into frame in front of the deputy's throat\n" +
        "          and jerk back and up.\n" +
        "\n" +
        "          Wider: the prisoner's momentum brings both men crashing\n" +
        "          backward to the floor, face-up, deputy on top.\n" +
        "          The deputy reaches up to try to get his hands under the\n" +
        "          strangling chain.\n" +
        "\n" +
        "          The prisoner brings pressure. His wrists whiten around the\n" +
        "          manacles.\n" +
        "\n" +
        "                          4\n" +
        "\n" +
        "                         \n" +
        "          The deputy's legs writhe and stamp. He moves in a clumsy\n" +
        "          circle, crabbing around the pivot-point of the other man's\n" +
        "          back arched against the floor.\n" +
        "\n" +
        "          The deputy's flailing legs kick over a wastebasket, send\n" +
        "          spinning the castored chair, slam at the desk.\n" +
        "\n" +
        "          Blood creeps around the friction points where the cuffs bite\n" +
        "          the prisoner's wrists. Blood is being spit by the deputy.\n" +
        "          The prisoner feels with his thumb at the deputy's neck and\n" +
        "          averts his own face. A yank of the chain ruptures the carotid\n" +
        "          artery. It jets blood.\n" +
        "\n" +
        "          The blood hits the office wall, drumming hollowly.\n" +
        "\n" +
        "          INT. SHERIFF LAMAR'S BATHROOM - DAY\n" +
        "\n" +
        "\n" +
        "                         \n" +
        "          The prisoner walks in, runs the water, and puts his wrists,\n" +
        "          now freed, under it.\n" +
        "\n" +
        "          INT. OFFICE - DAY\n" +
        "\n" +
        "          Close on the air tank. One hand, a towel wrapped at the wrist,\n" +
        "          reaches in to hoist it.\n" +
        "\n" +
        "          EXT. ROAD - LATE DAY\n" +
        "\n" +
        "          Road rushes under the lens. Point-of-view through a windshield\n" +
        "          of taillights ahead, the only pair in sight.\n" +
        "          A siren bloop.\n" +
        "\n" +
        "          The car pulls over. A four-door Ford sedan.\n" +
        "          The police car pulls over behind.\n" +
        "          The prisoner -- his name is Anton Chigurh -- gets out of the\n" +
        "          police car and slings the tank over his shoulder. He walks\n" +
        "          up the road to the man cranking down his window, groping for\n" +
        "          his wallet.\n" +
        "\n" +
        "                          MAN\n" +
        "          What's this about?\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Step out of the car please, sir.\n" +
        "          The motorist squints at the man with the strange apparatus.\n" +
        "\n" +
        "                          MAN\n" +
        "          Huh? What is...\n" +
        "\n" +
        "                          5\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          CHIGURH\n" +
        "          I need you to step out of the car,\n" +
        "           sir.\n" +
        "          The man opens his door and emerges.\n" +
        "\n" +
        "                          MAN\n" +
        "          Am I...\n" +
        "          Chigurh reaches up to the man's forehead with the end of the\n" +
        "          tube connected to the air tank.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Would you hold still please, sir.\n" +
        "          A hard pneumatic sound. The man flops back against the car.\n" +
        "          Blood trickles from a hole in the middle of his forehead.\n" +
        "\n" +
        "                         \n" +
        "          Chigurh waits for the body to slide down the car and crumple,\n" +
        "          clearing the front door. He opens it and hoists the air tank\n" +
        "          over into the front seat.\n" +
        "\n" +
        "          EXT. ARID PLAIN - DAY\n" +
        "\n" +
        "          Seen through an extreme telephoto lens. Heat shimmer rises\n" +
        "          from the desert floor.\n" +
        "          A pan of the horizon discovers a distant herd of antelope.\n" +
        "          The animals are grazing.\n" +
        "          Reverse on a man in blue jeans and cowboy boots sitting on\n" +
        "          his heels, elbows on knees, peering through a pair of\n" +
        "          binoculars. A heavy-barreled rifle is slung across his back.\n" +
        "          This is Moss.\n" +
        "          He lowers the binoculars, slowly unslings the rifle and looks\n" +
        "          through its sight.\n" +
        "          The view through the sight swims for a moment to refind the\n" +
        "          herd. One animal is staring directly at us, its motion\n" +
        "          arrested as if it's heard or seen something.\n" +
        "          Close on Moss's eyes, one at the sight, the other closed.\n" +
        "\n" +
        "                         HE MUTTERS:\n" +
        "\n" +
        "                          MOSS\n" +
        "          Hold still.\n" +
        "          He opens the free eye and rolls his head off the sight to\n" +
        "          give himself stereo.\n" +
        "\n" +
        "                         \n" +
        "          Close on the hatch-marked range dial on the sight. Moss\n" +
        "          delicately thumbs it.\n" +
        "\n" +
        "                          6\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "          He eases the one eye back onto the sight.\n" +
        "          Point-of-view through the sight: Moss adjusts to bring the\n" +
        "          cross-hairs back down to the staring animal.\n" +
        "          Moss's finger tightens on the trigger.\n" +
        "          Shot: gunbuck swishes the point-of-view upward.\n" +
        "          Moss fights it back down.\n" +
        "          The point-of-view through the sight finds the beast again,\n" +
        "          still staring at us.\n" +
        "          The sound of the gunshot rings out across the barial.\n" +
        "\n" +
        "                         \n" +
        "          Short beat.\n" +
        "          The bullet hits the antelope: not a kill. The animal recoils\n" +
        "          and runs, packing one leg.\n" +
        "          The other animals are off with it.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Shit.\n" +
        "          He stands and jacks out the spent casing which jangles against\n" +
        "          the rocks. He stoops for it and puts it in his shirt pocket.\n" +
        "\n" +
        "          EXT. ARID PLAIN - LATER\n" +
        "\n" +
        "          Moss is on foot, rifle again slung over his shoulder,\n" +
        "          binoculars around his neck. He is looking at the ground.\n" +
        "          An intermittent trail of blood.\n" +
        "          Moss's pace is brisk. Distances are long.\n" +
        "          He suddenly stops, staring.\n" +
        "          On the ground is the fresh trail of blood, the glistening\n" +
        "          drops already dry at the periphery. But this trail is crossed\n" +
        "          by another trail of blood. Drier.\n" +
        "          Moss looks one way along this older trail:\n" +
        "          His point-of-view: flatlands. Scrub. No movement.\n" +
        "          He looks the other way.\n" +
        "\n" +
        "                         \n" +
        "          A distant range of mountains. No movement.\n" +
        "          He stoops to examine the trail.\n" +
        "\n" +
        "                          7\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "          He paces it 'til he finds a print clear enough to give him\n" +
        "          the animal's orientation.\n" +
        "          He stands and looks again toward the distant mountains. He\n" +
        "          brings up the binoculars.\n" +
        "          His point-of-view: landscape, swimming into focus, heat waves\n" +
        "          exaggerated by the compression of the lens.\n" +
        "          Panning, looking for the animal.\n" +
        "          Movement, very distant. The animal is brought into focus: a\n" +
        "          black tailless dog, huge head, limping badly, phantasmal by\n" +
        "          virtue of the rippling heat waves and the silence.\n" +
        "          Moss lowers the glass. A moment of thought as he gazes off.\n" +
        "\n" +
        "                         \n" +
        "          He turns and heads in the direction from which the dog came.\n" +
        "\n" +
        "          EXT. RISE NEAR BASIN - MINUTES LATER\n" +
        "\n" +
        "          Moss tops a rise. He scans the landscape below.\n" +
        "          Not much to see except-distant glints, off something not\n" +
        "          native to the environment.\n" +
        "          Moss brings up the binoculars.\n" +
        "          Parked vehicles: three of them, squat, Broncos or other off-\n" +
        "          road trucks with fat tires, winches in the bed and racks of\n" +
        "          roof lights.\n" +
        "          On the ground near the trucks dark shapes lie still.\n" +
        "\n" +
        "          EXT. BASIN - MINUTES LATER\n" +
        "\n" +
        "          Moss is walking cautiously up to the site, unslung rifle at\n" +
        "          the ready.\n" +
        "          Flies drone.\n" +
        "          He circles two dead bodies lying in the grass, covered with\n" +
        "          blood. A gut-shot dog of the same kind we saw limping toward\n" +
        "          the mountains lies beside them. A sawed-off shotgun with a\n" +
        "          pistol stock lies in the grass.\n" +
        "          The tires and most of the window glass are shot out of the\n" +
        "          first pickup Moss approaches.\n" +
        "          He opens the door and looks inside.\n" +
        "\n" +
        "                         \n" +
        "          The driver is dead, leaning over the wheel. Moss shuts the\n" +
        "          door.\n" +
        "\n" +
        "                          8\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "          He opens the door of the second truck.\n" +
        "          The driver, sitting upright, still in shoulder harness, is\n" +
        "          staring at him.\n" +
        "          Moss stumbles back, raising the rifle.\n" +
        "          The man does not move. The front of his shirt is covered\n" +
        "          with blood.\n" +
        "\n" +
        "                          MAN\n" +
        "          Agua.\n" +
        "          Moss stares at him\n" +
        "\n" +
        "                          MAN\n" +
        "          ...Agua. Por Dios.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Ain't got no water.\n" +
        "          On the seat next to the man is an HK machine pistol. Moss\n" +
        "          looks at it. He looks back at the man. The man is still\n" +
        "          staring at him. Without lowering his eyes Moss reaches in\n" +
        "          and takes the pistol.\n" +
        "          Moss straightens up out of the truck and slings the rifle\n" +
        "          back over his shoulder. He snaps the clip off the machine\n" +
        "          pistol, checks it and snaps it back on.\n" +
        "          Moss crosses to the back of the truck and lifts the tarp\n" +
        "          that covers the truck bed.\n" +
        "          A load of brick-sized brown parcels each wrapped in plastic.\n" +
        "          He throws the tarp back over the load and crosses back to\n" +
        "          the open cab door.\n" +
        "\n" +
        "                          MAN\n" +
        "          Agua.\n" +
        "\n" +
        "                          MOSS\n" +
        "          I told you I ain't got no agua. You\n" +
        "           speak English?\n" +
        "          A blank look.\n" +
        "\n" +
        "                          MOSS\n" +
        "          ...Where's the last guy?\n" +
        "\n" +
        "                         \n" +
        "          The injured man stares, unresponsive. Moss persists:\n" +
        "\n" +
        "                          9\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          MOSS\n" +
        "          Ultimo hombre. Last man standing,\n" +
        "           must've been one. Where'd he go?\n" +
        "\n" +
        "                          MAN\n" +
        "          ...Agua.\n" +
        "          Moss turns to scan the horizon. He looks at the tire tracks\n" +
        "          extending back from the truck. He thinks for a beat.\n" +
        "\n" +
        "                          MOSS\n" +
        "\n" +
        "                          (TO HIMSELF)\n" +
        "          I reckon I'd go out the way I came\n" +
        "           in...\n" +
        "          He starts off.\n" +
        "\n" +
        "                         \n" +
        "          Through the truck's open door:\n" +
        "\n" +
        "                          MAN\n" +
        "          La puerta... Hay lobos...\n" +
        "\n" +
        "                          MOSS\n" +
        "\n" +
        "                          (WALKING OFF)\n" +
        "          Ain't no lobos.\n" +
        "\n" +
        "          EXT. FLATLAND NEAR THE BASIN - LATER\n" +
        "\n" +
        "          Moss stops to look out at a new prospect. Flatland, no cover.\n" +
        "          He raises the binoculars.\n" +
        "\n" +
        "                          MOSS\n" +
        "          If you stopped... to watch your\n" +
        "           backtrack... you're gonna shoot my\n" +
        "           dumb ass.\n" +
        "          He doesn't see anything. He lowers the glass, thinking.\n" +
        "          He raises the glass again.\n" +
        "\n" +
        "                          MOSS\n" +
        "          ...But. If you stopped... you stopped\n" +
        "           in shade.\n" +
        "          He sets off.\n" +
        "\n" +
        "          EXT. NEAR THE ROCK SHELF - DAY\n" +
        "\n" +
        "\n" +
        "                         A POINT-OF-VIEW\n" +
        "\n" +
        "                         \n" +
        "          Through the binoculars, some time later. One lone shelf of\n" +
        "          rock throws shade toward us. Heat shimmers in between.\n" +
        "\n" +
        "                          10\n" +
        "\n" +
        "                         \n" +
        "          Hard sun makes the rock shadow impenetrable. But there is a\n" +
        "          booted foot sticking into the sun toe-up like the nub on a\n" +
        "          sundial.\n" +
        "          Moss lowers the binoculars.\n" +
        "          He looks at his watch.\n" +
        "\n" +
        "          11:30.\n" +
        "         He sits down.\n" +
        "\n" +
        "                         FAST FADE\n" +
        "\n" +
        "          EXT. NEAR THE ROCK SHELF - DAY\n" +
        "\n" +
        "\n" +
        "                         THE WATCH\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "          12:30.\n" +
        "         Moss lowers the wristwatch and raises the binoculars again.\n" +
        "          The shadow has shifted. The foot hasn't moved.\n" +
        "          Moss gets up and walks toward it.\n" +
        "\n" +
        "          EXT. ROCK SHELF - MINUTES LATER\n" +
        "\n" +
        "          Moss arrives at the rock shelf.\n" +
        "          The man's body is tipped to one side. His nose is in the\n" +
        "          dirt but his eyes are open, as if he is examining something\n" +
        "          quite small on the ground.\n" +
        "          One hand holds a .45 automatic.\n" +
        "          Next to the body is a boxy leather document case.\n" +
        "          Moss looks at the man. He takes the gun, looks at it, sticks\n" +
        "          it in his belt.\n" +
        "          He drags the document case away from the body and opens it.\n" +
        "          Bank-wrapped hundreds fill it. Each packet is stamped\n" +
        "\n" +
        "          \"$10,000.\"\n" +
        "         Moss stares. He reaches in to rifle the stacks, either to\n" +
        "          confirm that the bag is full or to estimate the amount.\n" +
        "          He stands, looks around, looks back the way he came.\n" +
        "\n" +
        "                          11\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "          EXT. CATTLEGUARD ROAD - DAY\n" +
        "\n" +
        "\n" +
        "                         HIS TRUCK\n" +
        "         Moss's pickup is parked by a cattleguard off a paved but\n" +
        "          little-used road.\n" +
        "          Moss is just arriving. He throws in the document case, the\n" +
        "          rifle and the machine pistol, climbs into the cab and slams\n" +
        "          the door.\n" +
        "\n" +
        "          EXT. DESERT AIRE TRAILER PARK - TWILIGHT\n" +
        "\n" +
        "          Moss's truck pulls into a trailer park that sits alongside\n" +
        "          the highway on the outskirts of Sanderson, Texas. An old\n" +
        "          sign with a neon palm tree identifies the park as the Desert\n" +
        "          Aire.\n" +
        "\n" +
        "                         \n" +
        "          Moss gets out of the truck next to a double-wide. Lights\n" +
        "          glow inside. He takes the case and machine pistol, gets down\n" +
        "          on his back next to the trailer and scoots underneath it.\n" +
        "          His point-of-view: plywood and plastic pipes. He pulls some\n" +
        "          insulation aside and crams the machine pistol up under the\n" +
        "          pipes.\n" +
        "\n" +
        "          INT. TRAILER - NIGHT\n" +
        "\n" +
        "          Moss enters carrying the document case. A twentysomething\n" +
        "          woman in cutoff jeans and a halter top watches TV. This is\n" +
        "          Carla Jean.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          What's in the satchel?\n" +
        "\n" +
        "                          MOSS\n" +
        "          It's full a money.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          That'll be the day.\n" +
        "          Moss is crossing to a back bedroom. Before he disappears\n" +
        "          inside Carla Jean sees the pistol stuck in the back of his\n" +
        "          waistband.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          ...Where'd you get the pistol?\n" +
        "\n" +
        "                          MOSS\n" +
        "          At the gettin' place.\n" +
        "\n" +
        "                         \n" +
        "          He emerges without the case or the gun and crosses to the\n" +
        "          refrigerator. He takes a beer from the refrigerator and peels\n" +
        "          its pulltab.\n" +
        "\n" +
        "                          12\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          Did you buy that gun?\n" +
        "\n" +
        "                          MOSS\n" +
        "          No. I found it.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          Llewelyn!\n" +
        "\n" +
        "                          MOSS\n" +
        "          What? Quit hollerin'.\n" +
        "          He walks back sipping the beer and sprawls on the couch.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          What'd you give for that thing?\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          MOSS\n" +
        "          You don't need to know everthing,\n" +
        "           Carla Jean.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          I need to know that.\n" +
        "\n" +
        "                          MOSS\n" +
        "          You keep running that mouth I'm gonna\n" +
        "           take you in the back and screw you.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          Big talk.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Just keep it up.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          Fine. I don't wanna know. I don't\n" +
        "           even wanna know where you been all\n" +
        "           day.\n" +
        "\n" +
        "                          MOSS\n" +
        "          That'll work.\n" +
        "\n" +
        "          INT. TRAILER BEDROOM - NIGHT\n" +
        "\n" +
        "          We are drifting down toward Moss as he lies in bed next to\n" +
        "          Carla Jean. He lies still, eyes closed, but he is shaking\n" +
        "          his head. As the camera stops he opens his eyes, grimacing.\n" +
        "\n" +
        "                          MOSS\n" +
        "          All right.\n" +
        "\n" +
        "                         \n" +
        "          He looks at the bedside clock.\n" +
        "\n" +
        "                          13\n" +
        "\n" +
        "                         \n" +
        "          Its LED display: 1:06.\n" +
        "          He swings his legs off the bed, looks back at Carla Jean,\n" +
        "          and pulls the blanket up over her shoulder.\n" +
        "\n" +
        "          INT. TRAILER KITCHEN - NIGHT\n" +
        "\n" +
        "          Close on a gallon jug as Moss hold it under the tap, filling\n" +
        "          it with water.\n" +
        "          Carla Jean appears in the doorway, looking sleepy.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          Llewelyn.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Yeah.\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          What're you doin', baby?\n" +
        "\n" +
        "                          MOSS\n" +
        "          Goin' out.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          Goin' where?\n" +
        "\n" +
        "                          MOSS\n" +
        "          Somethin' I forgot to do. I'll be\n" +
        "           back.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          What're you goin' to do?\n" +
        "          Moss turns from the sink, screwing the top onto the jug.\n" +
        "\n" +
        "                          MOSS\n" +
        "          I'm fixin' to do somethin' dumbern\n" +
        "           hell but I'm goin' anyways.\n" +
        "          He starts toward the front door.\n" +
        "\n" +
        "                          MOSS\n" +
        "          ...If I don't come back tell Mother\n" +
        "           I love her.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          Your mother's dead, Llewelyn.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Well then I'll tell her myself.\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "          INT. TRUCK/EXT. CATTLEGUARD ROAD - NIGHT\n" +
        "\n" +
        "\n" +
        "                          14\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         A MAP\n" +
        "         A detailed topographical survey map, illuminated by a\n" +
        "          flashlight.\n" +
        "          Moss is studying it in the cab of his truck.\n" +
        "          After a beat he folds the map.\n" +
        "          He checks the .45 taken off the corpse with the money.\n" +
        "          Wider: the pickup truck parked outside the cattle guard.\n" +
        "          After a beat, the truck drives over the grate onto the unpaved\n" +
        "          part of the road, jogging up the uneven terrain.\n" +
        "          Through the windshield, the view is pitch black except for\n" +
        "          the boulders and scrub picked out by the crazily bouncing\n" +
        "          headlights.\n" +
        "\n" +
        "          EXT. BASIN - NIGHT\n" +
        "\n" +
        "\n" +
        "                         DOOR SLAM\n" +
        "         We are close on the water jug slapping against Moss's leg as\n" +
        "          we pull him through the darkness. The shape of his parked\n" +
        "          truck is just visible behind him, silhouetted on the crest\n" +
        "          by the glow of the moon already set.\n" +
        "          Walking across the basin to the near truck Moss freezes,\n" +
        "\n" +
        "                         NOTICING:\n" +
        "         Its driver's-side door: closed.\n" +
        "          Moss scans the horizon. Its only blemish remains his own\n" +
        "          pickup.\n" +
        "          He jogs the few remaining paces to the pickup. He sets down\n" +
        "          the gallon jug. Softly:\n" +
        "\n" +
        "                          MOSS\n" +
        "          Hello?...\n" +
        "          No answer.\n" +
        "          He opens the door.\n" +
        "          The man's body is still held upright by the shoulder harness\n" +
        "          but his head, flayed by buckshot, is tipped away.\n" +
        "          Moss glances at the bed of the truck.\n" +
        "\n" +
        "                         \n" +
        "          Empty.\n" +
        "          He again looks at the horizon.\n" +
        "\n" +
        "                          15\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "          Now another pickup stands in silhouette next to his own.\n" +
        "          Two men are there.\n" +
        "          Moss covers behind the dead man's truck. He eases his head\n" +
        "          out for another look.\n" +
        "          Only one man visible now.\n" +
        "          Sounds hard to identify. Something airy. Up on the crest his\n" +
        "          pickup rocks and settles. Its tires are being slashed.\n" +
        "          The other pickup's engine coughs to life. Headlights and\n" +
        "          roof lights go on.\n" +
        "          Moss again covers behind the vehicle.\n" +
        "\n" +
        "                         \n" +
        "          A search-spot sweeps back and forth across the basin tableau\n" +
        "          of bodies and trucks. After a few trips back and forth\n" +
        "          something happens to the spot: its weaving light begins to\n" +
        "          bounce. We can hear the jouncing suspension of the pickup as\n" +
        "          it trundles down the incline.\n" +
        "          But the light tells the perspective of the slowly approaching\n" +
        "          truck. Moss stays in the lee of his sheltering vehicle as he\n" +
        "          runs, doubled over, directly away from the light, keeping to\n" +
        "          the shadow that wipes on and off.\n" +
        "          A gunshot. Its impact kicks up dirt just ahead of Moss to\n" +
        "          his right.\n" +
        "          Moss turns to see:\n" +
        "          Two jogging men flanking the truck like infantry escorting a\n" +
        "          tank. One has just halted to fire; the other is now raising\n" +
        "          his gun.\n" +
        "          Moss tacks and sprints and rolls under a second abandoned\n" +
        "          pickup to his left. Another shot sounds and misses.\n" +
        "          Bullets plunk into the metal of the truck body. One bullet\n" +
        "          skips off the dirt in front of the truck and pings up into\n" +
        "          the undercarriage.\n" +
        "          Moss is elbowing out the far side, next to a body lying by\n" +
        "          the truck's passenger door.\n" +
        "          The firing has stopped: Moss steals a look over the hood:\n" +
        "          The pursuing pickup is slowing so that the two gunmen can\n" +
        "          swing onto the running boards.\n" +
        "\n" +
        "                         \n" +
        "          The truck accelerates and as it veers around the first\n" +
        "          abandoned pickup its lights swing off Moss's cover truck.\n" +
        "\n" +
        "                          16\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "          Moss sprints off, doubled over, at a perpendicular to his\n" +
        "          previous path. He hits the ground, pressing himself into the\n" +
        "          earth, head between his forearms.\n" +
        "          He elbows away as the truck bears on his former cover.\n" +
        "\n" +
        "          EXT. RIVER GORGE - DAWN\n" +
        "\n" +
        "          He tops the small rise and straightens and flat-out runs.\n" +
        "          We hear the pickup's engine racing and see, behind Moss, its\n" +
        "          spot sweeping backlight across the crest.\n" +
        "          Moss is running towards the declivity of a river gorge. Sky\n" +
        "          there is pink from unrisen sun.\n" +
        "          Moss bears on the gorge, panting.\n" +
        "\n" +
        "                         \n" +
        "          The pickup bounces up into view on the crest behind him,\n" +
        "          roof lights blazing. It is pointed off at an angle. Its\n" +
        "          spotlight sweeps the river plain.\n" +
        "          It finds Moss. The truck reorients as it bounces down in\n" +
        "          pursuit. A muzzle flash precedes the dull whump of the\n" +
        "          shotgun.\n" +
        "          Moss races on toward the river. Another shotgun whump.\n" +
        "          Moss stumbles, turns to look behind him.\n" +
        "          The truck, gaining ground. A man stands up out of the sunroof,\n" +
        "          one hand on top of the cab, the other holding a shotgun.\n" +
        "          Moss is almost to the steep riverbank. Another whump of the\n" +
        "          shotgun.\n" +
        "          Shot catches Moss on the right shoulder. It tears the back\n" +
        "          of his shirt away and sends him over the crest of the river\n" +
        "          bank.\n" +
        "          Moss airborne, ass over elbows, hits near the bottom of the\n" +
        "          sandy slope with a loud fhump.\n" +
        "          He rolls to a stop and looks up.\n" +
        "          We hear a skidding squeal and see dirt and dust float over\n" +
        "          the lip of the ridge, thrown by the truck's hard stop.\n" +
        "          As Moss pulls off his boots we hear voices from the men in\n" +
        "          the truck.\n" +
        "          There is the clank of its tailgate being dropped and sounds\n" +
        "          of activity on the hollow metal of its bed.\n" +
        "\n" +
        "                          17\n" +
        "\n" +
        "                         \n" +
        "          Moss tucks his boots into his belt and runs splashing into\n" +
        "          the fast-moving water. A look back:\n" +
        "          Something shakes the scrub down the steep slope.\n" +
        "          Moss backpedals deeper.\n" +
        "          Bursting out of the scrub at the foot of the slope: a huge\n" +
        "          black dog with a large head and clipped ears. It bounds toward\n" +
        "          Moss.\n" +
        "          Moss turns and half stumbles, half dives into the river.\n" +
        "          Underwater a very dull whump followed by the fizz of buckshot.\n" +
        "          Moss breaks the surface of the water, gasping, and looks\n" +
        "\n" +
        "                         BACK:\n" +
        "\n" +
        "                         \n" +
        "          Figures on the ridge. Below, the dog hitting the water.\n" +
        "          Another gunshot from the bank. Where it hits we don't know.\n" +
        "          River current and Moss's strokes speed him away.\n" +
        "\n" +
        "          EXT. RIVER BEND - DAWN\n" +
        "\n" +
        "          He sweeps around a bend. He finds his feet under him and\n" +
        "          staggers onto a sandbar and then splashes through some outwash\n" +
        "          to the far bank.\n" +
        "          The pursuing dog's head bobs rhythmically in the water.\n" +
        "          Moss pulls the gun from his belt. He takes the clip out and\n" +
        "          ejects the chamber round.\n" +
        "          The dog finds his stumpy legs much closer to the sandbar:\n" +
        "          his massive head dips and waggles as he lurches out of his\n" +
        "          swim. He emerges from the river and bounds across the sand.\n" +
        "          Moss shakes the gun and blows into the barrel.\n" +
        "          The dog splashes through the riverwash that separates him\n" +
        "          from the human.\n" +
        "          Moss reinserts the clip. He chambers a round as the dog runs\n" +
        "          snarling and as the dog leaps he fires.\n" +
        "          Moss fires twice more quickly, not waiting to see whether\n" +
        "          the first round told.\n" +
        "          The dog lands, stopped but not dead. It jerks and gurgles.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Goddamnit.\n" +
        "          He is looking out at the river. His boots are drifting by.\n" +
        "\n" +
        "                          18\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "\n" +
        "          EXT. RIVER BANK - DAY\n" +
        "\n" +
        "          Moss has climbed the far bank and found a seat on a rock.\n" +
        "          It is now full day. Moss has taken off his shirt and has his\n" +
        "          neck craned round and his back upper arm twisted toward him.\n" +
        "          Where the buckshot hit, his arm is purpled and pinpricked.\n" +
        "          He meticulously picks shirt fiber out from where buckshot\n" +
        "          packed it into the flesh.\n" +
        "          He finishes. He rips swatches from his shirt. He starts\n" +
        "          wrapping his bare feet as he gazes off.\n" +
        "          His point-of-view: a lot of landscape, a highway in the\n" +
        "          distance. An eighteen-wheeler shimmies along in the heat.\n" +
        "\n" +
        "          EXT. GAS STATION/GROCERY - SHEFFIELD - DAY\n" +
        "\n" +
        "\n" +
        "                         \n" +
        "          At an isolated dusty crossroad. It is twilight. The Ford\n" +
        "          sedan that Chigurh stopped is parked alongside the pump.\n" +
        "\n" +
        "          INT. GAS STATION/GROCERY - DAY\n" +
        "\n" +
        "          Chigurh stands at the counter across from the elderly\n" +
        "          proprietor. He holds up a bag of cashews.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          How much?\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          Sixty-nine cent.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          This. And the gas.\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          Y'all getting any rain up your way?\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          What way would that be?\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          I seen you was from Dallas.\n" +
        "          Chigurh tears open the bag of cashews and pours a few into\n" +
        "          his hand.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          What business is it of yours where\n" +
        "           I'm from, friendo?\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          I didn't mean nothin' by it.\n" +
        "\n" +
        "                          19\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Didn't mean nothin'.\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          I was just passin' the time.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          I guess that passes for manners in\n" +
        "           your cracker view of things.\n" +
        "          A beat.\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          Well sir I apologize. If you don't\n" +
        "           wanna accept that I don't know what\n" +
        "           else I can do for you.\n" +
        "\n" +
        "                         \n" +
        "          Chigurh stands chewing cashews, staring while the old man\n" +
        "          works the register and puts change on the counter.\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          ...Will there be somethin' else?\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          I don't know. Will there?\n" +
        "          Beat.\n" +
        "          The proprietor turns and coughs. Chigurh stares.\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          Is somethin' wrong?\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          With what?\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          With anything?\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Is that what you're asking me? Is\n" +
        "           there something wrong with anything?\n" +
        "          The proprietor looks at him, uncomfortable, looks away.\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          Will there be anything else?\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          You already asked me that.\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          Well... I need to see about closin'.\n" +
        "\n" +
        "                          20\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          CHIGURH\n" +
        "          See about closing.\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          Yessir.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          What time do you close?\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          Now. We close now.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Now is not a time. What time do you\n" +
        "           close.\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          Generally around dark. At dark.\n" +
        "          Chigurh stares, slowly chewing.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          You don't know what you're talking\n" +
        "           about, do you?\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          Sir?\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          I said you don't know what you're\n" +
        "           talking about.\n" +
        "          Chigurh chews.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          ...What time do you go to bed.\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          Sir?\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          You're a bit deaf, aren't you? I\n" +
        "           said what time do you go to bed.\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          Well...\n" +
        "          A pause.\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          ...I'd say around nine-thirty.\n" +
        "           Somewhere around nine-thirty.\n" +
        "\n" +
        "                          21\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          CHIGURH\n" +
        "          I could come back then.\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          Why would you be comin' back? We'll\n" +
        "           be closed.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          You said that.\n" +
        "          He continues to stare, chewing.\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          Well... I need to close now --\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          You live in that house behind the\n" +
        "           store?\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          Yes I do.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          You've lived here all your life?\n" +
        "          A beat.\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          This was my wife's father's place.\n" +
        "           Originally.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          You married into it.\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          We lived in Temple Texas for many\n" +
        "           years. Raised a family there. In\n" +
        "           Temple. We come out here about four\n" +
        "           years ago.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          You married into it.\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          ...If that's the way you wanna put\n" +
        "           it.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          I don't have some way to put it.\n" +
        "           That's the way it is.\n" +
        "\n" +
        "                          22\n" +
        "\n" +
        "                         \n" +
        "          He finishes the cashews and wads the packet and sets it on\n" +
        "          the counter where it begins to slowly unkink. The proprietor's\n" +
        "          eyes have tracked the packet. Chigurh's eyes stay on the\n" +
        "          proprietor.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          ...What's the most you've ever lost\n" +
        "           on a coin toss?\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          Sir?\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          The most. You ever lost. On a coin\n" +
        "           toss.\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          I don't know. I couldn't say.\n" +
        "          Chigurh is digging in his pocket. A quarter: he tosses it.\n" +
        "          He slaps it onto his forearm but keeps it covered.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Call it.\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          Call it?\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Yes.\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          For what?\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Just call it.\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          Well -- we need to know what it is\n" +
        "           we're callin' for here.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          You need to call it. I can't call it\n" +
        "           for you. It wouldn't be fair. It\n" +
        "           wouldn't even be right.\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          I didn't put nothin' up.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Yes you did. You been putting it up\n" +
        "           your whole life. You just didn't\n" +
        "           know it. You know what date is on\n" +
        "           this coin?\n" +
        "\n" +
        "                          23\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          No.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Nineteen fifty-eight. It's been\n" +
        "           traveling twenty-two years to get\n" +
        "           here. And now it's here. And it's\n" +
        "           either heads or tails, and you have\n" +
        "           to say. Call it.\n" +
        "          A long beat.\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          Look... I got to know what I stand\n" +
        "           to win.\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Everything.\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          How's that?\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          You stand to win everything. Call\n" +
        "           it.\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          All right. Heads then.\n" +
        "          Chigurh takes his hand away from the coin and turns his arm\n" +
        "          to look at it.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Well done.\n" +
        "          He hands it across.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          ...Don't put it in your pocket.\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          Sir?\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Don't put it in your pocket. It's\n" +
        "           your lucky quarter.\n" +
        "\n" +
        "                          PROPRIETOR\n" +
        "          ...Where you want me to put it?\n" +
        "\n" +
        "                          24\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Anywhere not in your pocket. Or it'll\n" +
        "           get mixed in with the others and\n" +
        "           become just a coin. Which it is.\n" +
        "          He turns and goes.\n" +
        "          The proprietor watches him.\n" +
        "\n" +
        "          EXT. DESERT AIRE - NIGHT\n" +
        "\n" +
        "          It is full night.\n" +
        "          Moss is pushing open the door to his trailer. We see Carla\n" +
        "          Jean inside.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          Llewelyn? What the hell?\n" +
        "          Moss enters and the door closes.\n" +
        "\n" +
        "          INT. MOSS' TRAILER - LATER\n" +
        "\n" +
        "          Carla Jean is finishing bandaging his arm.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Odessa.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          Why would we go to Odessa?\n" +
        "\n" +
        "                          MOSS\n" +
        "          Not we, you. Stay with your mother.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          Well -- how come?\n" +
        "\n" +
        "                         MOSS\n" +
        "         Right now it's midnight Sunday. When the courthouse opens\n" +
        "          nine hours from now someone's gonna be callin in the vehicle\n" +
        "          number off the inspection plate on my truck. And around nine-\n" +
        "          thirty they'll show up here.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          So... for how long do we have to...\n" +
        "\n" +
        "                          MOSS\n" +
        "          Baby, at what point would you quit\n" +
        "           botherin' to look for your two million\n" +
        "           dollars?\n" +
        "\n" +
        "                         \n" +
        "          Carla Jean stares, thinking.\n" +
        "\n" +
        "                          25\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          What'm I supposed to tell Mama?\n" +
        "\n" +
        "                          MOSS\n" +
        "          Try standin' in the door and hollerin:\n" +
        "           Mama I'm home.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "\n" +
        "                          LLEWELYN --\n" +
        "\n" +
        "                          MOSS\n" +
        "          C'mon, pack your things. Anything\n" +
        "           you leave you ain't gonna see again.\n" +
        "          Carla Jean begins peevishly tossing things into a bag:\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          Well thanks for fallin' all over and\n" +
        "           apologizing.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Things happened. I can't take 'em\n" +
        "           back.\n" +
        "\n" +
        "          EXT. CATTLEGUARD ROAD - NIGHT\n" +
        "\n" +
        "\n" +
        "          POINT-OF-VIEW THROUGH WINDSHIELD\n" +
        "         It is night. No other vehicles on this paved road.\n" +
        "          Our car turns off and rattles over a cattleguard.\n" +
        "          Parked on the other side is a Ramcharger. Its passenger door\n" +
        "          starts to open.\n" +
        "          Outside: Chigurh emerges from his Ford.\n" +
        "          The man emerging from the truck wears a Western-cut suit.\n" +
        "\n" +
        "                          MAN\n" +
        "          Mind ridin' bitch?\n" +
        "\n" +
        "          EXT. BASIN - NIGHT\n" +
        "\n" +
        "\n" +
        "                         THE RAMCHARGER\n" +
        "         Bouncing through ungraded terrain.\n" +
        "          It stops and discharges the three men-the driver and his\n" +
        "          partner, both in suits, from either side, and then Chigurh\n" +
        "          from the middle seat.\n" +
        "\n" +
        "                         \n" +
        "          They have pulled over at Moss's truck.\n" +
        "\n" +
        "                          26\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          CHIGURH\n" +
        "          This his truck?\n" +
        "          He is opening the door and looking at the plate riveted\n" +
        "          inside.\n" +
        "\n" +
        "                          MAN\n" +
        "          Mm-hm.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Screwgie.\n" +
        "          The man reaches into a pocket and hands over a screwdriver.\n" +
        "          As Chigurh works it under the plate:\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          ...Who slashed his tires?\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          DRIVER\n" +
        "          Wudden us.\n" +
        "\n" +
        "          EXT. BASIN - NIGHT\n" +
        "\n" +
        "          A flashlight beam picks out the dog carcass.\n" +
        "\n" +
        "                          DRIVER\n" +
        "          That's a dead dog.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Thank you.\n" +
        "          Chigurh plays the flashlight around the scene. Dead bodies\n" +
        "          on the ground.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          ...Where's the transponder?\n" +
        "\n" +
        "                          MAN\n" +
        "          In the truck. I'll get it.\n" +
        "\n" +
        "                          DRIVER\n" +
        "          These are some ripe petunias.\n" +
        "          Chigurh gives his flashlight to the driver.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Hold this please.\n" +
        "          He bends down and takes a 9 mm. Glock off of one of the dead\n" +
        "          bodies and checks the clip. The other man is returning from\n" +
        "          the truck. He hands Chigurh a small electronic receiver.\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          CHIGURH\n" +
        "          ...You getting anything on this?\n" +
        "\n" +
        "                          27\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          MAN\n" +
        "          Not a bleep.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          All right...\n" +
        "          Chigurh stands and holds his hand out for his flashlight.\n" +
        "          The driver hands it to him. Chigurh shines it in his face\n" +
        "          and shoots him through the forehead. As the man falls Chigurh\n" +
        "          pans the light to the other man who has watched his partner\n" +
        "          drop. He looks up, puzzled, and is shot as well.\n" +
        "\n" +
        "          EXT. BELL'S RANCH - MORNING\n" +
        "\n" +
        "          A horse trailer is backed up to a small stable with its gate\n" +
        "          down.\n" +
        "          Sheriff Bell, sixties, in uniform, slaps a horse on the ass\n" +
        "          and gives it a \"Hyah!\" to send it clattering up the ramp and\n" +
        "          into the trailer.\n" +
        "          His wife, Loretta, appears. She wears a heavy robe and holds\n" +
        "          a coffee mug.\n" +
        "\n" +
        "                          LORETTA\n" +
        "          I thought it was a car afire.\n" +
        "\n" +
        "                          BELL\n" +
        "          It is a car afire. But Wendell said\n" +
        "           there was something back country\n" +
        "           too.\n" +
        "\n" +
        "                          LORETTA\n" +
        "          When is the county gonna start payin'\n" +
        "           a rental on my horse.\n" +
        "\n" +
        "                          BELL\n" +
        "          Hyah!\n" +
        "          He is sending a second horse up into the trailer.\n" +
        "\n" +
        "                          BELL\n" +
        "          ...I love you more'n more, ever day.\n" +
        "\n" +
        "                          LORETTA\n" +
        "\n" +
        "                          (UNMOVED)\n" +
        "          That's very nice.\n" +
        "          Sheriff Bell puts up the gate and pins it. She watches.\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          LORETTA\n" +
        "          ...Be careful.\n" +
        "\n" +
        "                          28\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          BELL\n" +
        "          I always am.\n" +
        "\n" +
        "                          LORETTA\n" +
        "          Don't get hurt.\n" +
        "\n" +
        "                          BELL\n" +
        "          I never do.\n" +
        "\n" +
        "                          LORETTA\n" +
        "          Don't hurt no one.\n" +
        "\n" +
        "                          BELL\n" +
        "          Well. If you say so.\n" +
        "\n" +
        "          EXT. CATTLEGUARD ROAD - DAY\n" +
        "\n" +
        "\n" +
        "                         \n" +
        "          The pickup with horse trailer rattles up next to a parked\n" +
        "          squad car. Just beyond the cattle guard the Ford sedan is\n" +
        "          blazing. Sheriff Bell gets out of the truck and joins his\n" +
        "          deputy, Wendell, looking at the car. After a beat of staring:\n" +
        "\n" +
        "                          BELL\n" +
        "          You wouldn't think a car would burn\n" +
        "           like that.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          Yessir. We should a brought wieners.\n" +
        "          Sheriff Bell takes his hat off and mops his brow.\n" +
        "\n" +
        "                          BELL\n" +
        "          Does that look to you like about a\n" +
        "           '77 Ford, Wendell?\n" +
        "\n" +
        "                          WENDELL\n" +
        "          It could be.\n" +
        "\n" +
        "                          BELL\n" +
        "          I'd say it is. Not a doubt in my\n" +
        "           mind.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          The old boy shot by the highway?\n" +
        "\n" +
        "                          BELL\n" +
        "          Yessir, his vehicle. Man killed\n" +
        "           Lamar's deputy, took his car, killed\n" +
        "           someone on the highway, swapped for\n" +
        "           his car, and now here it is and he's\n" +
        "           swapped again for god knows what.\n" +
        "\n" +
        "                          29\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          WENDELL\n" +
        "          That's very linear Sheriff.\n" +
        "          Bell stares at the fire.\n" +
        "\n" +
        "                          BELL\n" +
        "          Well. Old age flattens a man.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          Yessir. But then there's this other.\n" +
        "           He nods up the ridge away from the\n" +
        "           highway.\n" +
        "\n" +
        "                          BELL\n" +
        "          Uh-huh.\n" +
        "          He walks back toward the trailer.\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          BELL\n" +
        "          ...You ride Winston.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          You sure?\n" +
        "\n" +
        "                          BELL\n" +
        "          Oh, I'm more than sure. Anything\n" +
        "           happens to Loretta's horse I can\n" +
        "           tell you right now you don't wanna\n" +
        "           be the party that was aboard.\n" +
        "\n" +
        "          EXT. BASIN - DAY\n" +
        "\n" +
        "          The two men on horseback pick their way through the scrub\n" +
        "          approaching Moss's truck. Sheriff Bell is studying the ground.\n" +
        "\n" +
        "                          BELL\n" +
        "          It's the same tire tread comin back\n" +
        "           as goin'. Made about the same time.\n" +
        "           You can see the sipes real clear.\n" +
        "          Wendell is standing in the stirrups, looking up the ridge.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          Truck's just yonder. Somebodies pried\n" +
        "           the inspection plate off the door.\n" +
        "          Bell looks up, circling the truck.\n" +
        "\n" +
        "                          BELL\n" +
        "          I know this truck. Belongs to a feller\n" +
        "           named Moss.\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          WENDELL\n" +
        "          Llewelyn Moss?\n" +
        "\n" +
        "                          30\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          BELL\n" +
        "          That's the boy.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          You figure him for a dope runner?\n" +
        "          Bell sits his horse looking at the slashed tires.\n" +
        "\n" +
        "                          BELL\n" +
        "          I don't know but I kindly doubt it.\n" +
        "\n" +
        "          BASIN - DAY\n" +
        "\n" +
        "          BY THE BODIES\n" +
        "         The two lawmen are dismounting.\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          WENDELL\n" +
        "          Hell's bells, they even shot the\n" +
        "           dog.\n" +
        "          They walk towards the near truck.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          ...Well this is just a deal gone\n" +
        "           wrong.\n" +
        "          Sheriff Bell stoops to look at casings.\n" +
        "\n" +
        "                          BELL\n" +
        "          Yes, appears to have been a glitch\n" +
        "           or two.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          What calibers you got there, Sheriff?\n" +
        "\n" +
        "                          BELL\n" +
        "          Nine millimeter. Couple of .45 ACP's.\n" +
        "          He stands, looking at the truck.\n" +
        "\n" +
        "                          BELL\n" +
        "          ...Somebody unloaded on this thing\n" +
        "           with a shotgun.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          Mm.\n" +
        "          Bell opens the door of the truck. Looks at the dead driver.\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          WENDELL\n" +
        "          ...How come do you reckon the coyotes\n" +
        "           ain't been at 'em?\n" +
        "\n" +
        "                          31\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          BELL\n" +
        "          I don't know...\n" +
        "          He shuts the door softly with two hands.\n" +
        "\n" +
        "                          BELL\n" +
        "          ...Supposedly they won't eat a\n" +
        "           Mexican.\n" +
        "          Wendell is looking at the two corpses close together, wearing\n" +
        "          suits.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          These boys appear to be managerial.\n" +
        "          Bell walks back toward the bed of the truck as Wendell\n" +
        "\n" +
        "                         APPRAISES:\n" +
        "\n" +
        "                          WENDELL\n" +
        "          ...I think we're lookin' at more'n\n" +
        "           one fracas.\n" +
        "          A gesture toward the scattered bodies.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          ...Wild West over there...\n" +
        "          A nod down at the two men in suits with head wounds.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          ...Execution here.\n" +
        "          Bell, at the back of the truck, wets a finger and runs it\n" +
        "          against the bed and looks at it.\n" +
        "\n" +
        "                          BELL\n" +
        "          That Mexican brown dope.\n" +
        "          Wendell strolls among the bodies.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          These boys is all swole up. So this\n" +
        "           was earlier: gettin set to trade.\n" +
        "           Then, whoa, differences... You know:\n" +
        "           might not of even been no money.\n" +
        "\n" +
        "                          BELL\n" +
        "          That's possible.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          But you don't believe it.\n" +
        "\n" +
        "                          32\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          BELL\n" +
        "          No. Probably I don't.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          It's a mess, ain't it Sheriff?\n" +
        "          Bell is remounting.\n" +
        "\n" +
        "                          BELL\n" +
        "          If it ain't it'll do til a mess gets\n" +
        "           here.\n" +
        "\n" +
        "          EXT. MOSS' TRAILER - DAY\n" +
        "\n" +
        "\n" +
        "                         AIR TANK\n" +
        "         We follow it being toted along a gravel path and up three\n" +
        "          shallow steps to a trailer door.\n" +
        "          A hand rises to knock. Tubing runs out of the sleeve and\n" +
        "          into the fist clenched to knock. The door rattles under the\n" +
        "          knock. A short beat.\n" +
        "          The hand opens to press the nozzle at the end of the tube\n" +
        "          against the lock cylinder. A sharp report.\n" +
        "\n" +
        "                         INSIDE\n" +
        "         A cylinder of brass from the door slams into the far wall\n" +
        "          denting it and drops to the floor and rolls.\n" +
        "          Reverse on the door. Daylight shows through the lock.\n" +
        "          The door swings slowly in and Chigurh, hard backlit, enters.\n" +
        "          He sets the tank down by the door. He looks around.\n" +
        "          He ambles in. He opens a door.\n" +
        "          The bedroom, a messy aftermath of hasty packing.\n" +
        "          The main room. Mail is stacked on the counter that separates\n" +
        "          a kitchen area.\n" +
        "          Chigurh flips unhurriedly through the pieces. One of them is\n" +
        "          a phone bill. He puts it in his pocket.\n" +
        "          He goes to the refrigerator. He opens it. He looks for a\n" +
        "          still beat. He decides.\n" +
        "          He reaches out a quart of milk. He goes to the main room\n" +
        "          sofa and sits. He pinches the spout open and drinks.\n" +
        "\n" +
        "                          33\n" +
        "\n" +
        "                         \n" +
        "          He looks at himself in the dead gray-green screen of the\n" +
        "          facing television.\n" +
        "\n" +
        "          INT. DESERT AIRE OFFICE - DAY\n" +
        "\n" +
        "          Chigurh enters. Old plywood paneling, gunmetal desk, litter\n" +
        "          of papers. A window air-conditioner works hard.\n" +
        "          A fifty-year-old woman with a cast-iron hairdo sits behind\n" +
        "          the desk.\n" +
        "\n" +
        "                          WOMAN\n" +
        "          Yessir?\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          I'm looking for Llewelyn Moss.\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          WOMAN\n" +
        "          Did you go up to his trailer?\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Yes I did.\n" +
        "\n" +
        "                          WOMAN\n" +
        "          Well I'd say he's at work. Do you\n" +
        "           want to leave a message?\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Where does he work?\n" +
        "\n" +
        "                          WOMAN\n" +
        "          I can't say.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Where does he work?\n" +
        "\n" +
        "                          WOMAN\n" +
        "          Sir I ain't at liberty to give out\n" +
        "           no information about our residents.\n" +
        "          Chigurh looks around the office. He looks at the woman.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Where does he work?\n" +
        "\n" +
        "                          WOMAN\n" +
        "          Did you not hear me? We can't give\n" +
        "           out no information.\n" +
        "          A toilet flushes somewhere. A door unlatches. Footsteps in\n" +
        "          back.\n" +
        "\n" +
        "                         \n" +
        "          Chigurh reacts to the noise. He looks at the woman. He turns\n" +
        "          and opens the door and leaves.\n" +
        "\n" +
        "                          34\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "\n" +
        "          INT. TRAILWAYS BUS - DAY\n" +
        "\n" +
        "          Some of the passengers are getting out. Moss is up in the\n" +
        "          aisle reaching a bag down from the overhead rack. He lifts\n" +
        "          the document case from the floor where Carla Jean still sits\n" +
        "          next to the window.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          Why all the way to Del Rio?\n" +
        "\n" +
        "                          MOSS\n" +
        "          I'm gonna borrow a car. From Eldon.\n" +
        "          Carla Jean nods at the document case.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          You can't afford one?\n" +
        "\n" +
        "                          MOSS\n" +
        "          Don't wanna register it. I'll call\n" +
        "           you in a couple days.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          Promise?\n" +
        "\n" +
        "                          MOSS\n" +
        "          Yes I do.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          I got a bad feelin', Llewelyn.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Well I got a good one. So they ought\n" +
        "           to even out. Quit worrying about\n" +
        "           everthing.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          Mama's gonna raise hell.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Uh-huh.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          She is just gonna cuss you up'n down.\n" +
        "\n" +
        "                          MOSS\n" +
        "          You should be used to that.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          I'm used to lots of things, I work\n" +
        "           at Wal-Mart.\n" +
        "\n" +
        "                          35\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          MOSS\n" +
        "          Not any more, Carla Jean. You're\n" +
        "           retired.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          Llewelyn?\n" +
        "\n" +
        "                          MOSS\n" +
        "          Yes ma'am?\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          You are comin back, ain't ya?\n" +
        "\n" +
        "                          MOSS\n" +
        "          I shall return.\n" +
        "\n" +
        "          EXT. MOSS'S TRAILER - DAY\n" +
        "\n" +
        "\n" +
        "                         \n" +
        "          Wendell is knocking at its door. Sheriff Bell stands one\n" +
        "          step behind him.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          Sheriff's Department!\n" +
        "          No answer.\n" +
        "\n" +
        "                          BELL\n" +
        "          Look at the lock.\n" +
        "          They both look. A beat.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          We goin' in?\n" +
        "\n" +
        "                          BELL\n" +
        "          Gun out and up.\n" +
        "          Wendell unholsters his gun but hesitates.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          What about yours?\n" +
        "\n" +
        "                          BELL\n" +
        "          I'm hidin' behind you.\n" +
        "          Wendell eases the door open.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          Sheriff's Department!\n" +
        "\n" +
        "          INT. MOSS' TRAILER - DAY\n" +
        "\n" +
        "\n" +
        "                         \n" +
        "          The men cautiously enter, Wendell leading.\n" +
        "\n" +
        "                          36\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          WENDELL\n" +
        "          ...Nobody here.\n" +
        "          He lowers his gun and starts to holster it.\n" +
        "\n" +
        "                          BELL\n" +
        "          No reason not to stay safe.\n" +
        "          Wendell keeps the gun out.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          No sir.\n" +
        "          He goes to the bedroom door as Sheriff Bell, seeing the lock\n" +
        "          cylinder on the floor, stoops and hefts it.\n" +
        "          He looks up at the wall opposite the door: the small dent.\n" +
        "\n" +
        "                         \n" +
        "          Wendell pulls his head out of the bedroom.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          ...I believe they've done lit a shuck.\n" +
        "\n" +
        "                          BELL\n" +
        "          Believe you're right.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          That from the lock?\n" +
        "          Sheriff Bell stands and wanders, looking around.\n" +
        "\n" +
        "                          BELL\n" +
        "          Probably must be.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          So when was he here?\n" +
        "\n" +
        "                          BELL\n" +
        "          I don't know. Oh.\n" +
        "          He is at the counter staring at something.\n" +
        "\n" +
        "                          BELL\n" +
        "          ...Now that's aggravating.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          Sheriff?\n" +
        "          Sheriff Bell points at the carton of milk.\n" +
        "\n" +
        "                          BELL\n" +
        "          Still sweating.\n" +
        "          Wendell is agitated.\n" +
        "\n" +
        "                          37\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          WENDELL\n" +
        "          Whoa! Sheriff!\n" +
        "          Sheriff Bell unhurriedly opens a cabinet. He looks closes\n" +
        "          it, opens another.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          ...Sheriff, we just missed him! We\n" +
        "           gotta circulate this! On the radio!\n" +
        "          Sheriff Bell takes a glass from the cabinet.\n" +
        "\n" +
        "                          BELL\n" +
        "          Well, okay...\n" +
        "          He pours milk into the glass.\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          BELL\n" +
        "          ...What do we circulate?\n" +
        "          He sits on the sofa and takes a sip from the milk.\n" +
        "\n" +
        "                          BELL\n" +
        "          ...Lookin' for a man who has recently\n" +
        "           drunk milk?\n" +
        "          Wendell stares at him.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          Sheriff, that's aggravating.\n" +
        "\n" +
        "                          BELL\n" +
        "          I'm ahead of you there.\n" +
        "          Wendell gazes around the trailer, shaking his head.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          You think this boy Moss has got any\n" +
        "           notion of the sorts of sons of bitches\n" +
        "           that are huntin' him?\n" +
        "\n" +
        "                          BELL\n" +
        "          I don't know. He ought to...\n" +
        "          Sheriff Bell takes another sip.\n" +
        "\n" +
        "                          BELL\n" +
        "          ...He seen the same things I seen\n" +
        "           and it made an impression on me.\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "          EXT. BUS STATION CAB STAND - DEL RIO - DAY\n" +
        "\n" +
        "          Moss emerges from the station and goes to a cab.\n" +
        "\n" +
        "                          38\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "          As he sits in:\n" +
        "\n" +
        "                          MOSS\n" +
        "          Take me to a motel.\n" +
        "\n" +
        "                          CABBIE\n" +
        "          You got one in mind?\n" +
        "\n" +
        "                          MOSS\n" +
        "          Just someplace cheap.\n" +
        "\n" +
        "          INT. DEL RIO MOTEL LOBBY - DAY\n" +
        "\n" +
        "\n" +
        "                         RATE CARD\n" +
        "         The rates for Charlie Goodnight's Del Rio Motor Court are\n" +
        "          under its address of Highway 84 East and an ovalled AAA logo:\n" +
        "           Single Person $24.00\n" +
        "           Double Bed/Couple $27.00\n" +
        "           2 Double Bed/Couple $28.00\n" +
        "           2 Double Bed/3 People $32.00\n" +
        "          Voices play off:\n" +
        "\n" +
        "                          WOMAN\n" +
        "          You tell me the option.\n" +
        "\n" +
        "                          MOSS\n" +
        "          The what?\n" +
        "\n" +
        "                          WOMAN\n" +
        "          The option.\n" +
        "          Wider shows that we are in a motel lobby. A woman faces Moss\n" +
        "          across a Formica counter top She has handed him the framed\n" +
        "          rate card.\n" +
        "\n" +
        "                          WOMAN\n" +
        "          ...You pick the option with the\n" +
        "           applicable rate.\n" +
        "\n" +
        "                          MOSS\n" +
        "          I'm just one person. Don't matter\n" +
        "           the size of the bed.\n" +
        "\n" +
        "          INT. MOTEL ROOM - DAY\n" +
        "\n" +
        "\n" +
        "                          39\n" +
        "\n" +
        "                         \n" +
        "          Wide on the room. Twin-bed headboards are fixed to the wall\n" +
        "          but only the far one has a bed parked beneath it. Moss sits\n" +
        "          on the bed, phone to his ear. It rings a couple times.\n" +
        "          He gives up, hangs up, rises.\n" +
        "\n" +
        "          INT. BATHROOM - DAY\n" +
        "\n" +
        "          Moss stands in front of the mirror, twisted around to examine\n" +
        "          the buckshot wound. He shrugs his shirt back on.\n" +
        "          Holding on the mirror we see him walk back into the main\n" +
        "          room and stop, looking around. He looks slowly up to the\n" +
        "          ceiling.\n" +
        "\n" +
        "          INT. MOTEL ROOM - DAY\n" +
        "\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "          CLOSE ON A SCREW\n" +
        "         Being unscrewed. Wider shows us Moss, standing on the bed,\n" +
        "          unscrewing the vent on an overhead airduct.\n" +
        "          He gets down off the bed, unzips his duffle bag and takes\n" +
        "          the document case out of it. He opens the case, takes out a\n" +
        "          packet of bills, counts out some money and puts it in his\n" +
        "          pocket. He refastens the case.\n" +
        "          He goes to the window and cuts off a length of the curtain\n" +
        "          cord. He ties the curtain cord to the handle of the document\n" +
        "          case. He goes to the closet, leaving the case on the bed.\n" +
        "          He reaches into the empty closet, lifts the coat rail off\n" +
        "          its supports and lets the hangers slide off onto the floor.\n" +
        "\n" +
        "          INT. LOOKING DOWN THE AIRDUCT - DAY\n" +
        "\n" +
        "          The duct hums with a low, airy compressor sound. The\n" +
        "          galvanized metal stretches away to a distant elbow. The\n" +
        "          document case is plunked down in the foreground and then\n" +
        "          gently pushed down the length of the tube by the coat pole.\n" +
        "          The free end of the cord trails off the handle for retrieval.\n" +
        "\n" +
        "          INT. MOTEL ROOM - DAY\n" +
        "\n" +
        "\n" +
        "                         THE DUFFLE\n" +
        "         Moss unzips it and pulls out the machine pistol and the .45\n" +
        "          that he took off the dead man. He lifts the mattress and\n" +
        "          stashes the machine pistol underneath. He checks the chamber\n" +
        "          of the .45 and stuffs it in his belt.\n" +
        "\n" +
        "                          40\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "          INT. MOTEL ROOM/EXT. PARKING LOT - DAY\n" +
        "\n" +
        "\n" +
        "                         THE WINDOW\n" +
        "         Moss pulls back one curtain to look out at the lot.\n" +
        "          Nothing there disturbs him.\n" +
        "          He closes the curtains, crossing one over the other.\n" +
        "          He goes out the door, shutting it softly behind him.\n" +
        "\n" +
        "          INT. ROADSIDE DINER - DAY\n" +
        "\n" +
        "\n" +
        "                         PHONE BILL\n" +
        "         A pencil taps at a Del Rio number that repeats on the bill.\n" +
        "          We hear phone-filtered rings.\n" +
        "          The rings are cut off by the clatter of a hang-up. The pencil\n" +
        "          moves to an Odessa number, the only other repeat on the short\n" +
        "          list of toll calls.\n" +
        "          We cut up to Chigurh as he finishes dialing, in the booth of\n" +
        "          a roadside diner. Dusk.\n" +
        "          Phone-filtered rings. Connection; a woman's voice:\n" +
        "\n" +
        "                          WOMAN\n" +
        "          Hello?\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Is Llewelyn there?\n" +
        "\n" +
        "                          WOMAN\n" +
        "          Llewelyn?! No he ain't.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          You expect him?\n" +
        "          The woman's voice is old, querulous:\n" +
        "\n" +
        "                          WOMAN\n" +
        "          Now why would I expect him? Who is\n" +
        "           this?\n" +
        "          Chigurh stares for a short beat, then prongs the phone.\n" +
        "\n" +
        "          INT. A SMALL GENERAL STORE - DAY\n" +
        "\n" +
        "          Moss is standing in front of a rack of cowboy boots at the\n" +
        "          back of the store. He looks up at an approaching salesman, a\n" +
        "          bow-legged old man in a white shirt.\n" +
        "\n" +
        "                          41\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          SALESMAN\n" +
        "          Hep you?\n" +
        "\n" +
        "                          MOSS\n" +
        "          I need the Larry Mahan's in black,\n" +
        "           size 11.\n" +
        "\n" +
        "                          SALESMAN\n" +
        "          Okay.\n" +
        "\n" +
        "                          MOSS\n" +
        "          You sell socks?\n" +
        "\n" +
        "                          SALESMAN\n" +
        "          Just white.\n" +
        "          He gathers up a brown paper bag from a pharmacy.\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          MOSS\n" +
        "          White is all I wear. You got a\n" +
        "           bathroom?\n" +
        "\n" +
        "          INT. BATHROOM - DAY\n" +
        "\n" +
        "          Moss is sitting on the toilet taking off socks with bloody\n" +
        "          soles. Sneakers sit on the floor. The pharmacy bag sits next\n" +
        "          to them.\n" +
        "          He sprays disinfectant on his feet. He takes out bandages.\n" +
        "\n" +
        "          INT. SHOE STORE - DAY\n" +
        "\n" +
        "          Moss is returning. The bowlegged salesman stands in the aisle\n" +
        "          holding aloft a pair of boots.\n" +
        "\n" +
        "                          SALESMAN\n" +
        "          Ain't got Larries in black but I got\n" +
        "           'em in osta-rich. Break in easy.\n" +
        "\n" +
        "          INT. CAB/EXT. DEL RIO MOTEL - NIGHT\n" +
        "\n" +
        "          It is rolling to a stop in front of Charlie Goodnight's Del\n" +
        "          Rio Motor Hotel.\n" +
        "          Moss fishes for his wallet but stops, looking.\n" +
        "          Parked in the street in front of the motel is an offroad\n" +
        "          truck with roof lights.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Don't stop. Just ride me up past the\n" +
        "           rooms.\n" +
        "\n" +
        "                          42\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          DRIVER\n" +
        "          What room?\n" +
        "\n" +
        "                          MOSS\n" +
        "          Just drive me around. I want to see\n" +
        "           if someone's here.\n" +
        "          The cab rolls slowly up the lot.\n" +
        "\n" +
        "                          MOSS\n" +
        "          ...Keep going.\n" +
        "          His pivoting point-of-view of his room. The window shows a\n" +
        "          part between the curtains.\n" +
        "\n" +
        "                          MOSS\n" +
        "          ...Keep going. Don't stop.\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          DRIVER\n" +
        "          I don't want to get in some kind of\n" +
        "           a jackpot here, buddy.\n" +
        "\n" +
        "                          MOSS\n" +
        "          It's all right.\n" +
        "\n" +
        "                          DRIVER\n" +
        "          Why don't I set you down here and we\n" +
        "           won't argue about it.\n" +
        "\n" +
        "                          MOSS\n" +
        "          I want you to take me to another\n" +
        "           motel.\n" +
        "\n" +
        "                          DRIVER\n" +
        "          Let's just call it square.\n" +
        "          Moss reaches a hundred-dollar bill up to the driver.\n" +
        "\n" +
        "                          MOSS\n" +
        "          You're already in a jackpot. I'm\n" +
        "           trying to get you out of it. Now\n" +
        "           take me to a motel.\n" +
        "          The driver reaches up for the bill then turns the cab out of\n" +
        "          the parking lot onto the hiway. Moss turns to look at the\n" +
        "          receding lights of the motel.\n" +
        "\n" +
        "          EXT. THROUGHWAY INTERCHANGE - NIGHT\n" +
        "\n" +
        "\n" +
        "                         PAVEMENT\n" +
        "\n" +
        "                         \n" +
        "          Rushing under the lens, lit by headlights.\n" +
        "\n" +
        "                          43\n" +
        "\n" +
        "                         \n" +
        "          From high up we see a throughway interchange as Chigurh's\n" +
        "          Ramcharger takes the right fork of the highway under a green\n" +
        "          sign for Del Rio.\n" +
        "\n" +
        "          INT. THE RAMCHARGER - NIGHT\n" +
        "\n" +
        "          Chigurh looks down at the passenger seat. On it lies the\n" +
        "          transponder, powered on but silent. Next to it is a machine\n" +
        "          pistol with a can-shaped silencer sweated onto the barrel.\n" +
        "          The transponder beeps once.\n" +
        "          Chigurh looks up. We are approaching a steel bridge. The\n" +
        "          headlights pick up a large black bird perched on the aluminum\n" +
        "          bridge rail.\n" +
        "          The passenger window hums down.\n" +
        "\n" +
        "                         \n" +
        "          Chigurh picks up the pistol and levels the barrel across the\n" +
        "          window frame.\n" +
        "          The truck bumps onto the bridge, its tires skipping over the\n" +
        "          seams in the asphalt. As it draws even the bird spreads its\n" +
        "          wings and Chigurh fires-a muted thump like a whoosh of air.\n" +
        "          From high overhead: the bullet hits the guardrail making it\n" +
        "          hum as the Ramcharger recedes and the bird lifts into the\n" +
        "          darkness, heavily flapping its wings.\n" +
        "\n" +
        "          INT. CAFE - MORNING\n" +
        "\n" +
        "          Morning. Bell sits drinking coffee. Wendell stands in the\n" +
        "          aisle handing something over.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          He labs from Austin on the man by\n" +
        "           the highway.\n" +
        "          Bell takes the papers and starts to look at them.\n" +
        "\n" +
        "                          BELL\n" +
        "          What was the bullet?\n" +
        "\n" +
        "                          WENDELL\n" +
        "          Wasn't no bullet.\n" +
        "          This brings Bell's look up.\n" +
        "\n" +
        "                          BELL\n" +
        "          Wasn't no bullet?\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          WENDELL\n" +
        "          Yessir. Wasn't none.\n" +
        "\n" +
        "                          44\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          BELL\n" +
        "          Well, Wendell, with all due respect,\n" +
        "           that don't make a whole lot of sense.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          No sir.\n" +
        "\n" +
        "                          BELL\n" +
        "          You said entrance wound in the\n" +
        "           forehead, no exit wound.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          Yes sir.\n" +
        "\n" +
        "                          BELL\n" +
        "          Are you telling me he shot this boy\n" +
        "           in the head and then went fishin'\n" +
        "           around in there with a pocket knife?\n" +
        "\n" +
        "                          WENDELL\n" +
        "          Sir, I don't want to picture that.\n" +
        "\n" +
        "                          BELL\n" +
        "          Well I don't either!\n" +
        "          A beat during which both men picture it, ended by an arriving\n" +
        "          waitress.\n" +
        "\n" +
        "                          WAITRESS\n" +
        "          Can I freshen that there for you\n" +
        "           Sheriff?\n" +
        "          The Sheriff's distressed look swings on to her.\n" +
        "\n" +
        "                          BELL\n" +
        "          Yes Noreen you better had. Thank\n" +
        "           you.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          The Rangers and DEA are heading out\n" +
        "           to the desert this morning. You gonna\n" +
        "           join 'em?\n" +
        "\n" +
        "                          BELL\n" +
        "          I don't know. Any new bodies\n" +
        "           accumulated out there?\n" +
        "\n" +
        "                          WENDELL\n" +
        "          No sir.\n" +
        "\n" +
        "                          BELL\n" +
        "          Well then I guess I can skip it.\n" +
        "           Heavens to Betsy, Wendell, you already\n" +
        "           put me off my breakfast.\n" +
        "\n" +
        "                          45\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "\n" +
        "          EXT. SPORTING GOODS STORE - DAY\n" +
        "\n" +
        "          Moss pushes off from the wall he was leaning against: someone\n" +
        "          inside the glass double doors is stooping to unlock them.\n" +
        "\n" +
        "          INT. SPORTING GOODS STORE - GUN COUNTER - DAY\n" +
        "\n" +
        "          The clerk is handing a shotgun across the counter.\n" +
        "\n" +
        "                          CLERK\n" +
        "          Twelve gauge. You need shells? Moss\n" +
        "           looks the gun over.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Uh-huh. Double ought.\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          CLERK\n" +
        "          They'll give you a wallop.\n" +
        "          He pushes the shells across.\n" +
        "\n" +
        "                          MOSS\n" +
        "          You have camping supplies?\n" +
        "\n" +
        "                         ANOTHER COUNTER\n" +
        "         A clerk stares at Moss.\n" +
        "\n" +
        "                          CLERK\n" +
        "          Tent poles.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Uh-huh.\n" +
        "\n" +
        "                          CLERK\n" +
        "          You already have the tent?\n" +
        "\n" +
        "                          MOSS\n" +
        "          Somethin' like that.\n" +
        "\n" +
        "                          CLERK\n" +
        "          Well you give me the model number of\n" +
        "           the tent I can order you the poles.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Never mind. I want a tent.\n" +
        "\n" +
        "                          CLERK\n" +
        "          What kind of tent?\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          MOSS\n" +
        "          The kind with the most poles.\n" +
        "\n" +
        "                          46\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          CLERK\n" +
        "          Well I guess that'd be our ten-foot\n" +
        "           backyard Per-Gola. You can stand up\n" +
        "           in it. Well, some people could stand\n" +
        "           up in it. Six foot clearance at the\n" +
        "           ridge. You might just could.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Let me have that one. Where's the\n" +
        "           nearest hardware store?\n" +
        "\n" +
        "          INT. MOSS' NEW MOTEL ROOM - DAY\n" +
        "\n" +
        "          He has the shotgun wedged in an open drawer and is sawing\n" +
        "          off its barrel with a hacksaw.\n" +
        "\n" +
        "                         MINUTES LATER\n" +
        "\n" +
        "                         \n" +
        "          Moss sits on the bed dressing the barrel with a file.\n" +
        "          He puts down the file, looks at the barrel. He slides the\n" +
        "          forearm back and forward again and lets the hammer down with\n" +
        "          his thumb. He looks the gun over, appraising, and then opens\n" +
        "          the box of shells and starts feeding in the heavy waxed loads.\n" +
        "\n" +
        "          INT. FIRST MOTEL LOBBY - DAY\n" +
        "\n" +
        "          Moss enters carrying a new duffle bag. The same woman is\n" +
        "          behind the counter.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Could I get another room.\n" +
        "\n" +
        "                          WOMAN\n" +
        "          You want to change rooms?\n" +
        "\n" +
        "                          MOSS\n" +
        "          No, I want to keep my room, and get\n" +
        "           another one.\n" +
        "\n" +
        "                          WOMAN\n" +
        "          Another additional.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Uh-huh.You got a map of the rooms?\n" +
        "          She inclines her head to look under the counter.\n" +
        "\n" +
        "                          WOMAN\n" +
        "          Yeah we had a sorta one.\n" +
        "\n" +
        "                         \n" +
        "          She finds a brochure and hands it across. It shows a car\n" +
        "          from the fifties parked in front of the hotel in hard\n" +
        "          sunlight.\n" +
        "\n" +
        "                          47\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "          Moss unfolds the brochure and studies.\n" +
        "\n" +
        "                          MOSS\n" +
        "          What about one forty-two.\n" +
        "\n" +
        "                          WOMAN\n" +
        "          You can have the one next to yours\n" +
        "           if you want. One twenty. It ain't\n" +
        "           took.\n" +
        "\n" +
        "                          MOSS\n" +
        "          No, one forty-two.\n" +
        "\n" +
        "                          WOMAN\n" +
        "          That's got two double beds.\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "          EXT. MOTEL PARKING LOT - DAY\n" +
        "\n" +
        "          An arcing point of view on the window of Moss's old room.\n" +
        "          The curtain still slightly open.\n" +
        "          A reverse shows Moss crossing the lot from the office carrying\n" +
        "          his long nylon duffle bag, studying the room. He looks\n" +
        "          further down the street.\n" +
        "          The truck with the roof lights is still parked there.\n" +
        "\n" +
        "          INT. 2ND MOTEL ROOM\n" +
        "\n" +
        "          Two double beds. Moss is listening at the wall. He goes to\n" +
        "          the bed and unzips the duffle bag and pulls out the sawed-\n" +
        "          off shotgun. He lays it on the bed. He pulls the tent poles\n" +
        "          and some duct tape out of the duffle.\n" +
        "\n" +
        "          INT. CHIGURH'S TRUCK/TWO LANE HIGHWAY - LATE DAY\n" +
        "\n" +
        "\n" +
        "                         CHIGURH\n" +
        "         Driving slowly down the street with frequent glances down at\n" +
        "          the receiver on the seat next to him. The receiver lights\n" +
        "          ups and bleeps one time.\n" +
        "          Chigurh slows and looks around at the buildings that line\n" +
        "          the two-lane highway.\n" +
        "\n" +
        "          INT. 2ND MOTEL ROOM - LATE DAY\n" +
        "\n" +
        "          Moss is standing on a desk chair unscrewing the plate from\n" +
        "          the overhead airduct. He lays it aside and raises a flashlight\n" +
        "          and peers into the airduct.\n" +
        "\n" +
        "                          48\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "          INT. MOTEL DUCT - LATE DAY\n" +
        "\n" +
        "          Down the length of the duct we see an elbow junction ten\n" +
        "          feet away. The end of the document case is just visible\n" +
        "          sticking out into the elbow.\n" +
        "\n" +
        "                         CHIGURH\n" +
        "         The receiver is bleeping slowly as the car creeps along. Up\n" +
        "          at a distant intersection is Charlie Goodnight's Del Rio\n" +
        "          Motel.\n" +
        "\n" +
        "          INT. 2ND MOTEL ROOM\n" +
        "\n" +
        "          Moss rips off a length of duct tape. He wraps it around two\n" +
        "          tent poles placed end-to-end but an inch apart, not butting.\n" +
        "          He gives the tape several winds.\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "          EXT. MOTEL PARKING LOT - LATE DAY\n" +
        "\n" +
        "\n" +
        "                         CHIGURH\n" +
        "         He is slowly driving the parking lot, the receiver now in\n" +
        "          his lap.\n" +
        "          The beeping frequency peaks and then starts to fall off.\n" +
        "          Chigurh puts the truck in reverse and eases back to the peak.\n" +
        "          His point-of-view: window with parted curtains.\n" +
        "\n" +
        "          INT. 2ND MOTEL ROOM - LATE DAY\n" +
        "\n" +
        "          Moss experiments with the tape-joint, angling then\n" +
        "          straightening the two poles. Satisfied, he starts taping on\n" +
        "          a third length of pole.\n" +
        "\n" +
        "          INT. MOTEL LOBBY - NIGHT\n" +
        "\n" +
        "          Chigurh stands across the counter from the clerk who looks\n" +
        "          at him, waiting.\n" +
        "          He is frowning at the rate card.\n" +
        "\n" +
        "          INT. CHIGURH'S MOTEL ROOM - NIGHT\n" +
        "\n" +
        "\n" +
        "                         DOOR\n" +
        "         It swings slowly in toward us. Chigurh stands in the doorway.\n" +
        "          The room-number bangle hangs off the key in the knob.\n" +
        "          He stares in for a beat.\n" +
        "\n" +
        "                          49\n" +
        "\n" +
        "                         \n" +
        "          He enters slowly and reaches up for the light switch. He\n" +
        "          doesn't turn it on. He drops his hand. He reaches up again,\n" +
        "          feeling it.\n" +
        "          He looks around the room. He takes the key and closes the\n" +
        "          door behind him.\n" +
        "\n" +
        "                         MOSS\n" +
        "         Moss pulls three wire hangers off the closet rack. He takes\n" +
        "          them to the bureau and picks up a sidecutter.\n" +
        "\n" +
        "                         CHIGURH\n" +
        "         He walks over to the bathroom.\n" +
        "          He turns on its light, looks.\n" +
        "\n" +
        "                         \n" +
        "          He leaves the door open. He goes to a closet, opens it, looks.\n" +
        "          He goes to the door of the room but doesn't open it. He stands\n" +
        "          with his back against it and looks at the room.\n" +
        "          The bathroom door.\n" +
        "          The closet door.\n" +
        "          Chigurh goes to the bed and sits to take off his boots.\n" +
        "\n" +
        "                         MOSS\n" +
        "         Moss snips the last of the wire hangers' hooks off with the\n" +
        "          sidecutter. He wraps the three hooks with duct tape to make\n" +
        "          a sturdier one.\n" +
        "          He wraps more tape to attach this hook to the end of the\n" +
        "          three-link pole.\n" +
        "\n" +
        "                         CHIGURH\n" +
        "         From a bag he withdraws a twelve-gauge automatic shotgun\n" +
        "          fitted with a silencer big around as a beer can.\n" +
        "          He checks the loads.\n" +
        "          He picks up the regularly beeping receiver, turns it off,\n" +
        "          and slips it into his pocket.\n" +
        "          He hoists the air tank.\n" +
        "\n" +
        "                          50\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         MOSS\n" +
        "         He is standing on the chair below the airduct, stooping to\n" +
        "          pick up the jury-rigged pole leaning nearby. He straightens\n" +
        "          and feeds the length of the pole into the duct, using the\n" +
        "          joints to angle it in.\n" +
        "\n" +
        "          INT. MOTEL DUCT - NIGHT\n" +
        "\n" +
        "          Inside the duct: he watches the pole play in, illuminated by\n" +
        "          the flashlight he has left resting inside.\n" +
        "\n" +
        "          EXT. MOTEL WALKWAY - NIGHT\n" +
        "\n" +
        "\n" +
        "                         STOCKINGED FEET\n" +
        "         We track on the feet padding down the exterior walkway.\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "          INT. MOTEL DUCT - NIGHT\n" +
        "\n" +
        "\n" +
        "                         MOSS\n" +
        "         Peering along the airduct, both hands up next to one ear\n" +
        "          awkwardly maneuvering the pole.\n" +
        "          He lays the far, hooked end over the protruding corner of\n" +
        "          the document case. He pulls.\n" +
        "          The pole slides off the case.\n" +
        "\n" +
        "          EXT./INT. 1ST MOTEL ROOM - NIGHT\n" +
        "\n" +
        "\n" +
        "                         CHIGURH\n" +
        "         He stands at the door of Moss's first room. He eases an ear\n" +
        "          against it.\n" +
        "          He steps back.\n" +
        "          He punches out the lock cylinder with the airgun and kicks\n" +
        "          in the door, raising the shotgun.\n" +
        "          A Mexican in a guyabera reclines on one of the two double\n" +
        "          beds.\n" +
        "          He is scrabbling for a machine pistol on the nightstand.\n" +
        "          Chigurh fires three times quickly. The damped blasts have\n" +
        "          the low resonance of chugs into a bottle.\n" +
        "\n" +
        "                         MOSS\n" +
        "\n" +
        "                         \n" +
        "          Head still in the airduct, frozen, listening.\n" +
        "\n" +
        "                          51\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "          EXT./INT. 1ST MOTEL ROOM - NIGHT\n" +
        "\n" +
        "\n" +
        "                         CHIGURH\n" +
        "         Also frozen, back against the wall outside the room, to one\n" +
        "          side of the open door.\n" +
        "          After a beat he steps back into the open doorway leveling\n" +
        "          the gun.\n" +
        "          Inside the room: no movement. Much of the man on the bed is\n" +
        "          spattered against the chewed-up headboard.\n" +
        "          The bathroom door is ajar, its light on.\n" +
        "          A long beat.\n" +
        "\n" +
        "                         \n" +
        "          Movement in the wedge of light.\n" +
        "          Immediately, chugs from the shotgun chew up bathroom door\n" +
        "          and nearby wallboard.\n" +
        "          A cry from inside. A brief chatter of machine pistol.\n" +
        "\n" +
        "          INT. MOTEL DUCT - NIGHT\n" +
        "\n" +
        "\n" +
        "                         MOSS'S POV\n" +
        "         Along the air vent.\n" +
        "          The machine-pistol chatter crosses the cut.\n" +
        "          We hear bullets snap through metal. The sound brings on\n" +
        "          indirect light as holes are punched in the duct somewhere\n" +
        "          around the bend.\n" +
        "          Moss holds still as the galvanized metal faintly thunders.\n" +
        "          The flashlight resting on it wobbles.\n" +
        "\n" +
        "          EXT./INT. 1ST MOTEL ROOM - NIGHT\n" +
        "\n" +
        "\n" +
        "                         CHIGURH\n" +
        "         Gun leveled, at the open door.\n" +
        "          Again, no movement.\n" +
        "          He advances into the room, gun pointing at the bathroom door.\n" +
        "          As he advances he swings the gun briefly over at the closet\n" +
        "          door and fires. The splintered-in door reveals no occupant.\n" +
        "\n" +
        "                         \n" +
        "          Chigurh angles around the double bed to get a view of that\n" +
        "          wedge of bathroom floor visible through its door. Blood is\n" +
        "          pooling out from the right.\n" +
        "\n" +
        "                          52\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "          Chigurh fires at the baseboard to the right of the door.\n" +
        "\n" +
        "          INT. MOTEL DUCT - NIGHT\n" +
        "\n" +
        "          Moss makes another attempt to hook the bag. The hook takes.\n" +
        "          Moss drags the case inches out into the duct's bend before\n" +
        "          the hook slides off again.\n" +
        "\n" +
        "          INT. 1ST MOTEL ROOM BATHROOM - NIGHT\n" +
        "\n" +
        "\n" +
        "                         CHIGURH\n" +
        "         He uses the shotgun barrel to push open what's left of the\n" +
        "          bathroom door.\n" +
        "\n" +
        "                         \n" +
        "          The mirror over the facing sink gives a view of most of the\n" +
        "          hidden side of the bedroom/ bathroom party wall. Partial\n" +
        "          view of a man pressed against the wall, standing in the tub\n" +
        "          in the corner. From his posture and the one visible hand he\n" +
        "          seems unarmed.\n" +
        "          Chigurh enters the bathroom.\n" +
        "          The cornered man is unhurt but terrified. He holds up his\n" +
        "          hands.\n" +
        "\n" +
        "                          MAN\n" +
        "          No me mate.\n" +
        "          The man on the floor is quite dead. A machine pistol lies in\n" +
        "          one out-flung hand.\n" +
        "          Chigurh looks back up at the survivor.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          How'd you find it?\n" +
        "\n" +
        "                          MAN\n" +
        "          No me mate.\n" +
        "          Chigurh walks unhurriedly to the tub. The man watches him,\n" +
        "          hands up, vibrating.\n" +
        "          Chigurh reaches with his free hand and pulls the shower\n" +
        "          curtain most of the way round, hiding the man. He angles the\n" +
        "          nose of the shotgun in and fires.\n" +
        "\n" +
        "                         MOSS\n" +
        "\n" +
        "                         \n" +
        "          The hook again snags a strap on the case. Moss pulls,\n" +
        "          carefully.\n" +
        "\n" +
        "                          53\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "          INT. 1ST MOTEL ROOM - MAIN ROOM - NIGHT\n" +
        "\n" +
        "          Chigurh emerges from the bathroom. His socks are sodden with\n" +
        "          gore. He sits on the bed and peels them off. He rubs the\n" +
        "          bottom of each foot with the ankle of each sock and drops\n" +
        "          the socks to the floor.\n" +
        "          He rises and opens three bureau drawers, which are empty,\n" +
        "          and leaves them open.\n" +
        "          He pulls open what remains of the closet door. Empty.\n" +
        "          He looks under the bed.\n" +
        "          He stands, looks around.\n" +
        "          He looks up. His look lingers.\n" +
        "\n" +
        "                         \n" +
        "          Close on the airduct grille: it is dusty. Rub-marks have\n" +
        "          made four dark bands across the dusty slats. Chigurh's fingers\n" +
        "          rise into frame and meet the grille, roughly aligning with\n" +
        "          the finger marks in the dust.\n" +
        "          Close on a screwhead: a dime enters and engages the screw\n" +
        "          and starts turning it.\n" +
        "\n" +
        "          INT. MOTEL DUCT - NIGHT\n" +
        "\n" +
        "          From inside the duct: fingers reach through the grille and\n" +
        "          Chigurh's hand pushes it up into the duct, then angles it\n" +
        "          and withdraws it. Faintly, under the distant airy drone of\n" +
        "          the compressor, we hear the grate clatter to the floor.\n" +
        "          The back of Chigurh's head appears. He aims a flashlight\n" +
        "          away down the far length of the duct. A beat.\n" +
        "          He pivots to face us.\n" +
        "          His point-of-view: the length of the duct, empty, with a\n" +
        "          drag-mark through the middle of the dust.\n" +
        "          Back to Chigurh. His look holds.\n" +
        "          He ducks out.\n" +
        "\n" +
        "          INT. 1ST MOTEL ROOM - NIGHT\n" +
        "\n" +
        "          In the room: Chigurh steps down from the chair and pulls the\n" +
        "          receiver from his pocket and turns it on.\n" +
        "          It beeps once.\n" +
        "\n" +
        "                         \n" +
        "          Silence.\n" +
        "\n" +
        "                          54\n" +
        "\n" +
        "                         \n" +
        "          Frowning, looking down at the receiver, Chigurh makes a slow\n" +
        "          sweep with it. The silence holds-snapped off by car steady\n" +
        "          as we cut to:\n" +
        "\n" +
        "          INT. STATION WAGON - NIGHT\n" +
        "\n" +
        "          Moss, with his duffle bag and document case, sits in the\n" +
        "          passenger seat of an old station wagon. The driver is an\n" +
        "          elderly man in a yoked shirt.\n" +
        "          After a beat, eyes fixed on the road, the old man shakes his\n" +
        "          head.\n" +
        "\n" +
        "                          OLD MAN\n" +
        "          Shouldn't be doin' that. Even a young\n" +
        "           man like you.\n" +
        "\n" +
        "                         \n" +
        "          Moss gives him a look. A beat.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Doin' what. The old man gazes at the\n" +
        "           road.\n" +
        "\n" +
        "                          OLD MAN\n" +
        "          Hitchhikin'.\n" +
        "          He shakes his head again. Silent driving. The old man murmurs:\n" +
        "\n" +
        "                          OLD MAN\n" +
        "          Dangerous.\n" +
        "\n" +
        "          EXT. DOWNTOWN HOUSTON - DAY\n" +
        "\n" +
        "\n" +
        "                         BOOMING UP\n" +
        "         We are looking out as a foreground building slips by and we\n" +
        "          rise to get an ever-higher perspective on downtown Houston,\n" +
        "          hazy under a noon sun.\n" +
        "\n" +
        "          INT. OFFICE - DAY\n" +
        "\n" +
        "          A man standing behind a large desk-behind him, floor-to-\n" +
        "          ceiling windows-has no small talk for Carson Wells, the man\n" +
        "          entering.\n" +
        "\n" +
        "                          MAN\n" +
        "          You know Anton Chigurh by sight, is\n" +
        "           that correct?\n" +
        "          Carson Wells sits in front of the desk, his manner affable.\n" +
        "          He rests a booted foot across one knee.\n" +
        "\n" +
        "                          55\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          WELLS\n" +
        "          Yessir, that's correct. I know 'em\n" +
        "           when I see 'em.\n" +
        "\n" +
        "                          MAN\n" +
        "          When did you last see him.\n" +
        "\n" +
        "                          WELLS\n" +
        "          November the 28th, last year.\n" +
        "\n" +
        "                          MAN\n" +
        "          You seem pretty sure of the date.\n" +
        "           Did I ask you to sit?\n" +
        "\n" +
        "                          WELLS\n" +
        "          No sir but you struck me as a man\n" +
        "           who wouldn't want to waste a chair.\n" +
        "           I remember dates. Names. Numbers. I\n" +
        "           saw him on November 28th.\n" +
        "          The man gazes. He nods.\n" +
        "\n" +
        "                          MAN\n" +
        "          We got a loose cannon here. And we're\n" +
        "           out a bunch of money, and the other\n" +
        "           party is out his product.\n" +
        "\n" +
        "                          WELLS\n" +
        "          Yessir. I understand that.\n" +
        "          The man looks at him, appraising. He nods again and slides a\n" +
        "          bank card across the table.\n" +
        "\n" +
        "                          MAN\n" +
        "          This account will only give up twelve\n" +
        "           hundred dollars in any twenty-four\n" +
        "           hour period. That's up from a\n" +
        "           thousand.\n" +
        "          Wells rises to take the card and then reseats himself.\n" +
        "\n" +
        "                          WELLS\n" +
        "          Yessir.\n" +
        "\n" +
        "                          MAN\n" +
        "          If your expenses run higher I hope\n" +
        "           you'll trust us for it.\n" +
        "\n" +
        "                          WELLS\n" +
        "          Okay.\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          MAN\n" +
        "          How well do you know Chigurh.\n" +
        "\n" +
        "                          56\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          WELLS\n" +
        "          Well enough.\n" +
        "\n" +
        "                          MAN\n" +
        "          That's not an answer.\n" +
        "\n" +
        "                          WELLS\n" +
        "          What do you want to know?\n" +
        "\n" +
        "                          MAN\n" +
        "          I'd just like to know your opinion\n" +
        "           of him. In general. Just how dangerous\n" +
        "           is he?\n" +
        "          Wells shrugs.\n" +
        "\n" +
        "                          WELLS\n" +
        "          Compared to what? The bubonic plague?\n" +
        "           He's bad enough that you called me.\n" +
        "           He's a psychopathic killer but so\n" +
        "           what? There's plenty of them around.\n" +
        "          A beat.\n" +
        "\n" +
        "                          MAN\n" +
        "          He killed three men in a motel in\n" +
        "           Del Rio yesterday. And two others at\n" +
        "           that colossal goatfuck out in the\n" +
        "           desert.\n" +
        "\n" +
        "                          WELLS\n" +
        "          Okay. We can stop that.\n" +
        "\n" +
        "                          MAN\n" +
        "          You seem pretty sure of yourself.\n" +
        "           You've led something of a charmed\n" +
        "           life haven't you Mr. Wells?\n" +
        "          Wells rises.\n" +
        "\n" +
        "                          WELLS\n" +
        "          In all honesty I can't say that charm\n" +
        "           has had a whole lot to do with it.\n" +
        "          He thumps once at his chest.\n" +
        "\n" +
        "                          WELLS\n" +
        "          ...I'm wondering...\n" +
        "\n" +
        "                          MAN\n" +
        "          Yes?\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          WELLS\n" +
        "          Can I get my parking ticket validated?\n" +
        "\n" +
        "                          57\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "          The man gazes.\n" +
        "\n" +
        "                          MAN\n" +
        "          ...An attempt at humor, I suppose.\n" +
        "\n" +
        "                          WELLS\n" +
        "          I'm sorry.\n" +
        "\n" +
        "                          MAN\n" +
        "          Goodbye, Mr. Wells.\n" +
        "\n" +
        "          EXT. EAGLE PASS TOWN SQUARE - DUSK\n" +
        "\n" +
        "          Moss is getting out of the station wagon with his duffle and\n" +
        "          document case.\n" +
        "\n" +
        "                         \n" +
        "          It is a town square. Among the old buildings is the Hotel\n" +
        "          Eagle, identified by a neon above the front door.\n" +
        "\n" +
        "          INT. HOTEL EAGLE LOBBY - NIGHT\n" +
        "\n" +
        "          Moss enters. Behind the front desk an older man sits reading\n" +
        "          Ring magazine. He has a hand-rolled cigarette.\n" +
        "\n" +
        "                          MOSS\n" +
        "          One room, one night.\n" +
        "\n" +
        "                          CLERK\n" +
        "          That's twenty-six dollars.\n" +
        "\n" +
        "                          MOSS\n" +
        "          You on all night?\n" +
        "\n" +
        "                          CLERK\n" +
        "          Yessir, be here til ten tomorrow\n" +
        "           morning.\n" +
        "          Moss pushes a hundred along with smaller bills across the\n" +
        "          desk.\n" +
        "\n" +
        "                          MOSS\n" +
        "          For you. I ain't asking you to do\n" +
        "           anything illegal.\n" +
        "          The clerk looks at the hundred-dollar bill without reaching.\n" +
        "\n" +
        "                          CLERK\n" +
        "          I'm waitin' to hear your description\n" +
        "           of that.\n" +
        "\n" +
        "                          58\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          MOSS\n" +
        "          There's somebody lookin' for me. Not\n" +
        "           police. Just call me if anyone else\n" +
        "           checks in tonight.\n" +
        "\n" +
        "          INT. SECOND-FLOOR HALLWAY - NIGHT\n" +
        "\n" +
        "          Moss is mounting the stairs from the lobby. The carpeted\n" +
        "          hallway is lined by transom-topped doors. Moss goes to a\n" +
        "          door halfway down on his left.\n" +
        "\n" +
        "          INT. HOTEL ROOM - NIGHT\n" +
        "\n" +
        "          Moss enters a room with old oak furniture and high ceilings.\n" +
        "          He sets the document case next to the bed.\n" +
        "          He unzips the duffel and takes out the shotgun which he lays\n" +
        "          on the bed, and then goes to the window. He parts the curtain\n" +
        "          to look down.\n" +
        "          The street is empty. Mexican music floats up faintly from a\n" +
        "          bar somewhere not far away.\n" +
        "\n" +
        "          INT. HOTEL ROOM - LATER\n" +
        "\n" +
        "          The room is dark. The music is gone.\n" +
        "          We are looking straight down on Moss lying, clothed, on the\n" +
        "          bed. We are booming straight down toward him.\n" +
        "          After a beat he shakes his head. He opens his eyes,\n" +
        "          grimacing.\n" +
        "\n" +
        "                          MOSS\n" +
        "          There just ain't no way.\n" +
        "          He sits up and turns on the bedside lamp.\n" +
        "          The shot gun and document case are on the floor by the bed.\n" +
        "          Moss swings the document case onto the bed and unclasps it\n" +
        "          and upends the money onto the bed. He feels the bottom of\n" +
        "          the case, squeezing it with one hand inside and one hand\n" +
        "          out, looking for a false bottom. He eyeballs the case, turning\n" +
        "          it over and around.\n" +
        "          He starts riffling money packets.\n" +
        "          He finds one that binds. It has hundreds on the outside but\n" +
        "          ones inside with the centers cut out. In the hollow is a\n" +
        "          sending unit the size of a Zippo lighter.\n" +
        "\n" +
        "                         \n" +
        "          He holds the sender, staring at it.\n" +
        "          A long beat.\n" +
        "\n" +
        "                          59\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "          From somewhere, a dull chug. The sound is hard to read-a\n" +
        "          compressor going on, a door thud, maybe something else.\n" +
        "          The sound has brought Moss's look up. He sits listening. No\n" +
        "          further sound.\n" +
        "          Moss reaches to uncradle the rotary phone by the bed. He\n" +
        "          dials 0.\n" +
        "          We hear ringing filtered through the handset. Also, faintly,\n" +
        "          offset, we hear the ring direct from downstairs.\n" +
        "          After five rings Moss cradles the phone.\n" +
        "          He goes to the door, reaches for the knob, but hesitates.\n" +
        "\n" +
        "                         \n" +
        "          He gets down on his hands and knees and listens at the crack\n" +
        "          under the door.\n" +
        "          An open airy sound like a seashell put to your ear.\n" +
        "          Moss rises and turns to the bed. He piles money back into\n" +
        "          the document case but freezes suddenly-for no reason we can\n" +
        "          see.\n" +
        "          A long beat on his motionless back. We gradually become aware\n" +
        "          of a faint high-frequency beeping, barely audible. Its source\n" +
        "          is indeterminate.\n" +
        "          Moss clasps the document case, picks up his shotgun and eases\n" +
        "          himself to a sitting position on the bed, facing the door.\n" +
        "          He looks at the line of light under it.\n" +
        "          The beeps approach, though still not loud. A long wait.\n" +
        "          At length a soft shadow appears in the line of light below\n" +
        "          the door. It lingers there. The beeping-stops.\n" +
        "          A beat. Now the soft shadow becomes more focused. It resolves\n" +
        "          into two columns of dark: feet planted before the door.\n" +
        "          Moss raises his shotgun toward the door.\n" +
        "          A long beat.\n" +
        "          Moss adjusts his grip on the shotgun and his finger tightens\n" +
        "          on the trigger.\n" +
        "          The shadow moves, unhurriedly, rightward. The band of light\n" +
        "          beneath the door is once again unshadowed.\n" +
        "          Quiet. Moss stares.\n" +
        "\n" +
        "                          60\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "          The band of light under the door.\n" +
        "          Moss stares.\n" +
        "          Silently, the light goes out.\n" +
        "          Something for Moss to think about. He stares.\n" +
        "          The hallway behind the door is now dark. The door is defined\n" +
        "          only from his side, by streetlight-spill through the window.\n" +
        "          Moss stares. He shifts, starts to rise, doesn't. A beat.\n" +
        "          A report -- not a gunshot, but a stamping sound, followed by\n" +
        "          a pneumatic hiss.\n" +
        "\n" +
        "                         \n" +
        "          It brings a dull impact and Moss recoils, hit.\n" +
        "          He winces, feeling his chest.\n" +
        "          The door is shuddering creakily in.\n" +
        "          It is all strange. Moss gropes in his lap and picks something\n" +
        "          up. The lock cylinder.\n" +
        "          The creaking door comes to rest, ajar.\n" +
        "          Moss fires. The shotgun blast roars in the confined space\n" +
        "          and for an instant turns the room orange. The chewed-up door\n" +
        "          wobbles back against the jamb and creakily bounces in again.\n" +
        "          Moss has already risen and is hoisting the document case.\n" +
        "\n" +
        "          FROM OUTSIDE HIS WINDOW\n" +
        "         Moss finishes draping his shotgun by its strap across his\n" +
        "          back and climbs out onto the ledge with the document case.\n" +
        "          He swings the document case out and drops it.\n" +
        "          The bracketing for the hotel's sign gives Moss a handhold.\n" +
        "          He grabs it as inside the room the door is kicked open. Moss\n" +
        "          swings down as, with a muted thump, orange muzzleflash strobes\n" +
        "          the room.\n" +
        "          Moss drops.\n" +
        "\n" +
        "          EXT. HOTEL EAGLE SIDEWALK - NIGHT\n" +
        "\n" +
        "          Moss lands and grabs the document case and straightens. He\n" +
        "          is at the hotel entrance, standing in the light coming through\n" +
        "          the etched glass of the double doors.\n" +
        "\n" +
        "                          61\n" +
        "\n" +
        "                         \n" +
        "          He looks at his own shadow thrown onto the street. He plunges\n" +
        "          through the doors into the lobby as a gun thumps and crackling\n" +
        "          shot chews the sidewalk.\n" +
        "\n" +
        "          INT. LOBBY - NIGHT\n" +
        "\n" +
        "          Moss hurries across the lobby. A glance to one side:\n" +
        "          A booted foot sticks out from behind the front desk.\n" +
        "          Moss slows approaching the stairway. He risks a look around\n" +
        "          the stairway wall.\n" +
        "          Ascending balusters fade off into the blackness of the second-\n" +
        "          story hallway.\n" +
        "          Moss sags. He looks back across the lobby at the front door.\n" +
        "\n" +
        "                         \n" +
        "          He unhitches his shotgun. He remains still for a moment\n" +
        "          holding the shotgun, back against the protected side of the\n" +
        "          wall.\n" +
        "          He quickly swings out and with shotgun aimed up the stairs\n" +
        "          he crosses to the back lobby.\n" +
        "          He quietly pushes open the back door.\n" +
        "\n" +
        "          EXT. SERVICE ALLEY - NIGHT\n" +
        "\n" +
        "\n" +
        "                         OUTSIDE\n" +
        "         Moss emerges into a shallow service alley, dark and dirty.\n" +
        "          He is at a run when we hear soft tock and a garbage can in\n" +
        "          front of him snaps and wobbles.\n" +
        "          He turns looking up, backpedaling. Another tock accompanies\n" +
        "          a muzzleflash in a dark second-story window.\n" +
        "          Moss fires his shotgun: loud. Chips fly off the brickface\n" +
        "          and the window shatters.\n" +
        "          Moss rounds the alley corner. He stops and squats.\n" +
        "\n" +
        "          EXT. DOWNTOWN EAGLE PASS STREET - NIGHT\n" +
        "\n" +
        "          Wide: dark, deserted downtown Eagle Pass, Moss a lone figure\n" +
        "          resting at a corner.\n" +
        "          Close on Moss panting. He takes stock, painfully feeling at\n" +
        "          his upper chest where the lock hit, then touching gingerly\n" +
        "          at his side, beneath the ribs, newly bloody. He sighs.\n" +
        "\n" +
        "                          62\n" +
        "\n" +
        "                         \n" +
        "          He listens. No noise. He gets to his feet with the document\n" +
        "          case in one hand and shotgun in the other. He waits a beat,\n" +
        "          back against the wall.\n" +
        "          He swings out and fires the shotgun into the alley and then\n" +
        "          spins back and runs a short block and rounds the next corner\n" +
        "          and stops to rest.\n" +
        "\n" +
        "          EXT. EAGLE PASS STREET - NIGHT\n" +
        "\n" +
        "          He waits for his breath to slow. He brings up the shotgun\n" +
        "          and readies himself.\n" +
        "          He swings out to look back around the corner.\n" +
        "          The street is empty.\n" +
        "\n" +
        "                         \n" +
        "          He waits, at the ready for whatever might emerge from the\n" +
        "          alley mouth a short block away.\n" +
        "          Long beat. Stillness.\n" +
        "          A panicky thought brings his look and the shotgun swinging\n" +
        "          back around: the man could round the block the other way.\n" +
        "          Empty street.\n" +
        "          Two empty streets: Moss doesn't know which way to cover,\n" +
        "          which way to go.\n" +
        "          He stands looking each way, trying to devise a plan. No basis\n" +
        "          for a plan.\n" +
        "          Quiet hesitation.\n" +
        "          Now, a sound: engine noise.\n" +
        "          An old pickup rounds a corner two blocks up. It rattles toward\n" +
        "          him.\n" +
        "          Moss lowers the shotgun. He keeps it to the hidden side of\n" +
        "          his body.\n" +
        "          The pickup dutifully stops at a flashing red traffic light.\n" +
        "          It comes on through the intersection.\n" +
        "          Moss strides out into the street. He swings the shotgun up\n" +
        "          and gives the driver a raised palm to halt.\n" +
        "\n" +
        "          INT. PICKUP/EXT. EAGLE PASS STREET - NIGHT\n" +
        "\n" +
        "\n" +
        "                         \n" +
        "          The truck stops and Moss opens the passenger door and swings\n" +
        "          the case in and climbs in after.\n" +
        "\n" +
        "                          63\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "          The driver, an older man, gapes at him, frightened.\n" +
        "\n" +
        "                          MOSS\n" +
        "          I'm not going to hurt you. I need\n" +
        "           you to --\n" +
        "          The windshield stars.\n" +
        "          A quick second round pushes part of the windshield in.\n" +
        "          Rounds come in without pause, cracking sheet metal, blowing\n" +
        "          the cab's rear window into the truckbed, twisting the rear-\n" +
        "          view.\n" +
        "          A round seems to have caught the driver in the throat: a\n" +
        "          gurgling scream as he claws at his windpipe, blowing out\n" +
        "          blood.\n" +
        "          Moss, quicker to react, has already ducked below the dash.\n" +
        "          A snap of the driver's head and a new freshet of blood from\n" +
        "          a shot to the head. The screams turn to low gurgles.\n" +
        "          Moss, jammed almost in to the driver's lap, frantically gropes\n" +
        "          for the shift.\n" +
        "          He throws the pickup into drive and stamps at the accelerator,\n" +
        "          driving blind as bullets continue to pour in.\n" +
        "          He raises his head enough to see his side-view. It shows\n" +
        "          sluing, bouncing, empty street, rough guide for steering.\n" +
        "          A tremendous jounce up onto the curb then off it, the driver's\n" +
        "          body swaying in its restraint.\n" +
        "          The passenger side window shatters: we are passing the gunman.\n" +
        "          Now Moss sits up to steer looking out front. Behind him\n" +
        "          through the shot-out back window the dark street is suddenly\n" +
        "          punctured by muzzleflash. It comes, for the first time, with\n" +
        "          a report: the low chug of the muted shotgun.\n" +
        "          Rattle of shot against sheet metal.\n" +
        "          Moss floors the gas to roar into a turn. The street sweeping\n" +
        "          out of view behind him produces one more chugging muzzleflash.\n" +
        "\n" +
        "          EXT. EAGLE PASS STREET - NIGHT\n" +
        "\n" +
        "          The pickup bounces but Moss, sitting fully up, can now steer.\n" +
        "\n" +
        "                          64\n" +
        "\n" +
        "                         \n" +
        "          He goes half the length of the block and then yanks the wheel\n" +
        "          hard, braking. The pickup smashes a parked car and jacks\n" +
        "          around to a halt.\n" +
        "          Moss emerges from the pickup with his shotgun and goes to\n" +
        "          the sidewalk and backtracks. He covers behind a parked car.\n" +
        "          He sits leaning back against the car, waiting.\n" +
        "          His point-of-view: his own reflection in the facing\n" +
        "          storefront, a lot of the driver's blood on him.\n" +
        "          He sinks lower.\n" +
        "          A long beat.\n" +
        "          Footsteps. They approach without hurry.\n" +
        "\n" +
        "                         \n" +
        "          A gritty boot turn at the corner. The footsteps come closer\n" +
        "          still.\n" +
        "          They pass and recede toward the pickup.\n" +
        "          We cut to Chigurh approaching the pickup, shotgun held at\n" +
        "          ease across his body.\n" +
        "          He slows.\n" +
        "          Moss: he hears the slowing steps. He tightens his grip on\n" +
        "          his shotgun and tenses.\n" +
        "          Chigurh: slowing further, he sees:\n" +
        "          Bloody boot prints outside the passenger door.\n" +
        "          Moss rises.\n" +
        "          Chigurh is turning.\n" +
        "          He dives as, behind him, Moss fires.\n" +
        "          Shot peppers two parked cars -- the one Moss rammed and the\n" +
        "          one behind.\n" +
        "          Chigurh dived between them: hit or not?\n" +
        "          Moss advances down the middle of the street. He angles his\n" +
        "          head: anything under the cars?\n" +
        "          He fires twice. Buckshot claws up the pavement and the car\n" +
        "          bodies and tires, and the cars sink hissing to their rims.\n" +
        "\n" +
        "                         \n" +
        "          Moss crosses to the far curb, still advancing. No one behind\n" +
        "          the cars.\n" +
        "\n" +
        "                          65\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "          He looks up and down the street.\n" +
        "          Nothing to see.\n" +
        "          He goes to the pickup truck, driver's side. He opens the\n" +
        "          door and reaches over the driver's corpse for his lap belt.\n" +
        "\n" +
        "          EXT. EAGLE PASS BORDER AREA - NIGHT\n" +
        "\n" +
        "          Deserted.\n" +
        "          The pickup truck rattles into frame.\n" +
        "          Moss emerges. He hoists out the case. He leaves the shotgun.\n" +
        "          It is very quiet.\n" +
        "\n" +
        "                         \n" +
        "          He looks around.\n" +
        "          The Rio Grande bridge.\n" +
        "          Moss walks unsteadily toward it, pressing his free hand to\n" +
        "          his side.\n" +
        "          A thought stops him. He turns.\n" +
        "          His bloody boot prints point at him like comic book clues.\n" +
        "          His shoulders sag.\n" +
        "\n" +
        "          EXT. RIO GRANDE BRIDGE - NIGHT\n" +
        "\n" +
        "          Minutes later. Moss heads down the right-hand walkway in\n" +
        "          stockinged feet, boots tucked into his belt.\n" +
        "          He turns and looks back toward the U.S. side.\n" +
        "          Empty walkway.\n" +
        "          He proceeds on. Three youths are approaching from the Mexican\n" +
        "          side. Fart types, they are laughing and walking unsteadily.\n" +
        "          As they approach they gape at Moss, covered with blood.\n" +
        "          The lead boy, holding a beer, wears a light coat.\n" +
        "\n" +
        "                          MOSS\n" +
        "          I'll give you five hundred bucks for\n" +
        "           your shirt and your coat.\n" +
        "\n" +
        "                         \n" +
        "          The three boys stare at him.\n" +
        "\n" +
        "                         AT LENGTH:\n" +
        "\n" +
        "                          66\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          YOUTH\n" +
        "          Let's see the money.\n" +
        "          Moss unpeels bills from a moist wad. The top one is bloody.\n" +
        "\n" +
        "                          SECOND YOUTH\n" +
        "          ...Were you in a car accident?\n" +
        "\n" +
        "                          MOSS\n" +
        "          Yeah.\n" +
        "\n" +
        "                          YOUTH\n" +
        "          Okay, lemme have the money.\n" +
        "\n" +
        "                          MOSS\n" +
        "          It's right here. Give me the coat.\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          YOUTH\n" +
        "          Lemme hold the money.\n" +
        "          Moss does.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Gimme the clothes.\n" +
        "          The youth starts to peel them.\n" +
        "\n" +
        "                          MOSS\n" +
        "          ...And let me have your beer.\n" +
        "\n" +
        "                          YOUTH\n" +
        "          ...How much?\n" +
        "\n" +
        "                          SECOND YOUTH\n" +
        "          Brian. Give him the beer.\n" +
        "\n" +
        "                         MINUTES LATER\n" +
        "         The boys are receding. Moss pours the beer over his head,\n" +
        "          rubbing blood away.\n" +
        "          He opens his shirt. He inspects the wounds in his midriff,\n" +
        "          entrance and exit. Pulsing blood laps weakly out. He shrugs\n" +
        "          off his shirt, wraps it around his waist and knots it.\n" +
        "          He starts to put on the new shirt. Something stops him. He\n" +
        "          pauses.\n" +
        "          He vomits into the roadbed.\n" +
        "\n" +
        "                         \n" +
        "          He straightens slowly and puts on the new shirt.\n" +
        "          He looks out.\n" +
        "\n" +
        "                          67\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "          He is not yet over the river: wind stirs the cane on the\n" +
        "          bank.\n" +
        "          He looks up: Chain-link fence encloses the walkway to a height\n" +
        "          of about twelve feet, curling inward at the top.\n" +
        "          He looks down the walkway. The three boys are distant figures.\n" +
        "          He looks up the walkway.\n" +
        "          A few paces up a light pole stanchion stands flush to the\n" +
        "          guardrail that separates road and walkway.\n" +
        "          He goes to the stanchion and uses it to hoist himself onto\n" +
        "          the guardrail, his free hand holding the case.\n" +
        "\n" +
        "                         \n" +
        "          Standing on top of the curved metal rail and holding the\n" +
        "          post for balance, he kneebends down and up and heaves the\n" +
        "          case.\n" +
        "          It sails clear of the chain-link fence. A short beat and we\n" +
        "          hear a thump.\n" +
        "          Moss pants for a moment, recovering from the strain of the\n" +
        "          toss. He eases himself off the guardrail and goes to the\n" +
        "          fence and looks at the bank below. One gnarled tree stands\n" +
        "          out in the cane. The case, wherever it landed, is not visible.\n" +
        "\n" +
        "          EXT. GUARDSHACK MEXICAN SIDE - NIGHT\n" +
        "\n" +
        "          There is a lighted guardshack at the end of the walkway.\n" +
        "          Inside, a uniformed guard.\n" +
        "          Moss walks unsteadily up. He tilts the beer bottle in salute\n" +
        "          at the guard.\n" +
        "          The guard impassively lets him proceed.\n" +
        "\n" +
        "          EXT. MEXICAN SQUARE - DAWN\n" +
        "\n" +
        "\n" +
        "                         BLACK\n" +
        "         In black, an insanely cheerful mariachi song.\n" +
        "          Fade in on the mariachis. We are looking steeply up at them,\n" +
        "          dutch-angled. They beam down at us, energetically thumping\n" +
        "          their oversized guitars and bajo sextos.\n" +
        "          We boom woozily up and start to un-dutch.\n" +
        "\n" +
        "                         \n" +
        "          Reverse on Moss struggling to a sitting position on the park\n" +
        "          bench where he'd been lying. A public square.\n" +
        "\n" +
        "                          68\n" +
        "\n" +
        "                         \n" +
        "          Back to the mariachis. Beaming, singing.\n" +
        "          Their smiles gradually fade.\n" +
        "          The playing falls off to silence.\n" +
        "          In the silence, birds chirp. The musicians are looking\n" +
        "          quizzically down.\n" +
        "          Moss's arm swings up in the foreground, extending a bloody\n" +
        "          hundred-dollar bill.\n" +
        "          On Moss. His coat has swung open to expose his bloody midriff.\n" +
        "          His look up is glazed.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Doctor.\n" +
        "\n" +
        "                         \n" +
        "          The mariachis stare. Moss waggles the bill.\n" +
        "\n" +
        "                          MOSS\n" +
        "          ...Medico. Por favor.\n" +
        "\n" +
        "          INT. RAMCHARGER/EXT. WAL-MART - DAY\n" +
        "\n" +
        "          We are close on a patch of its front seat. Day. The pickup\n" +
        "          is parked. The piece of upholstery we are looking at has\n" +
        "          blood soaked into it.\n" +
        "          On the sound of the door opening we cut wider. We are in the\n" +
        "          parking lot of a Wal-Mart. Chigurh, climbing in, tosses a\n" +
        "          brown paper bag onto the passenger side. He has a dark towel\n" +
        "          wrapped around one leg. As he slides behind the wheel the\n" +
        "          wrapped part of his leg slides over the bloodstain.\n" +
        "\n" +
        "          INT. RAMCHARGER/EXT. PHARMACY - DAY\n" +
        "\n" +
        "\n" +
        "          TRAVELING POINT OF VIEW\n" +
        "         A small-town main street. We are driving past a pharmacy.\n" +
        "          Chigurh, looking.\n" +
        "          He parks.\n" +
        "          He takes a scissors from the Wal-Mart bag and a box of cotton.\n" +
        "          He opens the box and cuts a little disc out of the cardboard.\n" +
        "          He takes a new shirt out of the bag and begins to cut through\n" +
        "          one sleeve.\n" +
        "\n" +
        "                          69\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "          EXT. PHARMACY - DAY\n" +
        "\n" +
        "\n" +
        "          SHOOTING PAST A PARKED CAR\n" +
        "         Chigurh limps toward us. He holds a coat hanger bent straight\n" +
        "          with the balled-up shirtsleeve hooked at one end.\n" +
        "          Chigurh arrives, looks up and down the street.\n" +
        "          He unscrews the gas cap, feeds the coat hanger in to soak\n" +
        "          the shirt, pulls it back out. He tapes the cardboard disc\n" +
        "          over the open gas tank. He unhooks the wet shirtsleeve and\n" +
        "          jams it up over the disk. He lights it and exits.\n" +
        "\n" +
        "          INSIDE THE PHARMACY - DAY\n" +
        "         A beat pulling Chigurh limping up the aisle, and then the\n" +
        "          car explodes out front. The plate glass storefront blows in.\n" +
        "          The few people inside rush out; Chigurh doesn't react.\n" +
        "          The pharmacy counter in back is deserted. Chigurh lifts a\n" +
        "          hinged piece of counter to enter and starts looking through\n" +
        "          the stock.\n" +
        "          He pulls out a packet of syringes, Hydrocodone tablets,\n" +
        "          penicillin.\n" +
        "\n" +
        "          INT. SMALL TOWN MOTEL ROOM - DAY\n" +
        "\n" +
        "          Chigurh dumps the pharmaceuticals into the bathroom sink.\n" +
        "          In the room outside he sits on the bed and takes off his\n" +
        "          boots. He unknots the towel from around his leg and stands\n" +
        "          and unbuttons his pants and starts cutting from the crotch\n" +
        "          down with a heavy scissors. One thigh is a mess of clotted\n" +
        "          blood and torn fabric.\n" +
        "\n" +
        "          INT. MOTEL BATHROOM - DAY\n" +
        "\n" +
        "\n" +
        "                         BATH\n" +
        "         Chigurh lowers himself into bath water that quickly turns\n" +
        "          pink. He laves water over his bloody thigh. There is a dark\n" +
        "          red hole, one half inch across, pulsing blood into the bath\n" +
        "          water Torn pieces of fabric from his pants are embedded in\n" +
        "          the bleeding skin.\n" +
        "\n" +
        "          A SHAVING MIRROR\n" +
        "         We are looking at the wound in a magnifying mirror. Forceps\n" +
        "          enter and pluck a tiny piece of blood-soaked fabric from the\n" +
        "          skin.\n" +
        "\n" +
        "                          70\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         RUNNING WATER\n" +
        "         A bathroom tap. The forceps enter. They are rinsed, shaken\n" +
        "          off.\n" +
        "          Wider: Chigurh sits on the closed toilet with the mirror\n" +
        "          sitting on the edge of the tub, angled toward the wound.\n" +
        "          Chigurh works on cleaning it.\n" +
        "\n" +
        "          INT. SMALL TOWN MOTEL ROOM - DAY\n" +
        "\n" +
        "          The main room. The TV is on now. Chigurh enters from the\n" +
        "          bathroom with his leg bandaged. He sits on the bed and tears\n" +
        "          open the packaging of a syringe.\n" +
        "          He plunges it into an ampule of penicillin.\n" +
        "\n" +
        "                         \n" +
        "          He injects himself.\n" +
        "\n" +
        "          INT. SHERIFF'S OFFICE - DAY\n" +
        "\n" +
        "          Sheriff Bell sits writing in a large leatherette checkbook.\n" +
        "\n" +
        "                         HE PROJECTS:\n" +
        "\n" +
        "                          BELL\n" +
        "          Anything on those vehicles yet?\n" +
        "          A raised female voice from the front office:\n" +
        "\n" +
        "                          VOICE\n" +
        "          Sheriff I found out everything there\n" +
        "           was to find. Those vehicles are titled\n" +
        "           and registered to deceased people.\n" +
        "          Molly, the secretary, appears at the doorway.\n" +
        "\n" +
        "                          VOICE\n" +
        "          ...The owner of that Blazer died\n" +
        "           twenty years ago. Did you want me to\n" +
        "           see what I could find out about the\n" +
        "           Mexican ones?\n" +
        "\n" +
        "                          BELL\n" +
        "          No. Lord no.\n" +
        "          He holds out the checkbook.\n" +
        "\n" +
        "                          BELL\n" +
        "          ...This month's checks.\n" +
        "\n" +
        "                          MOLLY\n" +
        "          That DEA agent called again. You\n" +
        "           don't want to talk to him?\n" +
        "\n" +
        "                          71\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          BELL\n" +
        "          I'm goin' to try and keep from it as\n" +
        "           much as I can.\n" +
        "\n" +
        "                          MOLLY\n" +
        "          He's goin' back out there and he\n" +
        "           wanted to know if you wanted to go\n" +
        "           with him.\n" +
        "          Sheriff Bell is putting things away.\n" +
        "\n" +
        "                          BELL\n" +
        "          Well that's cordial of him. I guess\n" +
        "           he can go wherever he wants. He's a\n" +
        "           certified agent of the United States\n" +
        "           Government.\n" +
        "\n" +
        "                         \n" +
        "          He rises.\n" +
        "\n" +
        "                          BELL\n" +
        "          ...Could I get you to call Loretta\n" +
        "           and tell her I've gone to Odessa?\n" +
        "           goin' to visit with Carla Jean Moss.\n" +
        "\n" +
        "                          MOLLY\n" +
        "          Yes Sheriff.\n" +
        "\n" +
        "                          BELL\n" +
        "          I'll call Loretta when I get there.\n" +
        "           I'd call now but she'll want me to\n" +
        "           come home and I just might.\n" +
        "\n" +
        "                          MOLLY\n" +
        "          You want me to wait til you've quit\n" +
        "           the building?\n" +
        "\n" +
        "                          BELL\n" +
        "          Yes I do. You don't want to lie\n" +
        "           without what it's absolutely\n" +
        "           necessary.\n" +
        "          Molly trails him into the front office.\n" +
        "\n" +
        "                          BELL\n" +
        "          ...What is it that Torbert says?\n" +
        "           About truth and justice?\n" +
        "\n" +
        "                          MOLLY\n" +
        "          We dedicate ourselves daily anew.\n" +
        "           Something like that.\n" +
        "\n" +
        "                          72\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          BELL\n" +
        "          I think I'm goin' to commence\n" +
        "           dedicatin' myself twice daily. It\n" +
        "           may come to three times before it's\n" +
        "           over...\n" +
        "          A loud truck-by from the street outside. Sheriff Bell's eyes\n" +
        "          track the passing vehicle.\n" +
        "\n" +
        "                          BELL\n" +
        "          ...What the hell?\n" +
        "\n" +
        "          EXT. STREET - DAY\n" +
        "\n" +
        "          Sanderson outskirts.\n" +
        "          Sheriff Bell passes a flatbed truck with a flapping tarp and\n" +
        "          briefly blurps his siren to pull it over. He parks on the\n" +
        "          shoulder in front of the truck and then walks back to the\n" +
        "          driver who watches his approach, chewing gum with blithe\n" +
        "          unconcern.\n" +
        "\n" +
        "                          DRIVER\n" +
        "          Sheriff.\n" +
        "\n" +
        "                          BELL\n" +
        "          Have you looked at your load lately?\n" +
        "\n" +
        "          A MINUTE LATER\n" +
        "         Both men are at the back of the truck.\n" +
        "\n" +
        "                          BELL\n" +
        "          That's a damned outrage.\n" +
        "\n" +
        "                          DRIVER\n" +
        "          Oh. One of the tiedowns worked lose.\n" +
        "          Bell whips the tarp back to expose eight corpses wrapped\n" +
        "          blue sheeting bound with tape.\n" +
        "\n" +
        "                          BELL\n" +
        "          How many did you leave with?\n" +
        "          The driver is still smiling.\n" +
        "\n" +
        "                          DRIVER\n" +
        "          I ain't lost none of 'em, Sheriff.\n" +
        "\n" +
        "                          BELL\n" +
        "          Couldn't you all of took a van out\n" +
        "           there?\n" +
        "\n" +
        "                          73\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          DRIVER\n" +
        "          Didn't have no van with four-wheel\n" +
        "           drive.\n" +
        "          Sheriff Bell pulls the tarp down and ties it. The driver\n" +
        "          watches without helping.\n" +
        "\n" +
        "                          DRIVER\n" +
        "          ...You going to write me up for\n" +
        "           improperly secured load?\n" +
        "          Sheriff Bell cinches the knot tight.\n" +
        "\n" +
        "                          BELL\n" +
        "          You get your ass out of here.\n" +
        "\n" +
        "          INT. HOSPITAL ROOM - DAY\n" +
        "\n" +
        "\n" +
        "                         \n" +
        "          Moss, in bed, stirs at an off screen voice:\n" +
        "\n" +
        "                          VOICE\n" +
        "          I'm guessin'... this is not the future\n" +
        "           you pictured for yourself when you\n" +
        "           first clapped eyes on that money.\n" +
        "          Moss blearily focuses on:\n" +
        "          A fancy crocodile boot.\n" +
        "          His look rises from the boot, crossed on his visitor's knee,\n" +
        "          up to the man's face.\n" +
        "          Carson Wells smiles at him from the bedside chair.\n" +
        "\n" +
        "                          WELLS\n" +
        "          ...Don't worry. I'm not the man that's\n" +
        "           after you.\n" +
        "\n" +
        "                          MOSS\n" +
        "          I know, I've seen him. Sort of.\n" +
        "          Wells is surprised.\n" +
        "\n" +
        "                          WELLS\n" +
        "          You've seen him. And you're not dead.\n" +
        "          He nods, impressed.\n" +
        "\n" +
        "                          WELLS\n" +
        "          ...But that won't last.\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          MOSS\n" +
        "          What is he supposed to be, the\n" +
        "           ultimate bad-ass?\n" +
        "\n" +
        "                          74\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          WELLS\n" +
        "          I don't think that's how I would\n" +
        "           describe him.\n" +
        "\n" +
        "                          MOSS\n" +
        "          How would you describe him?\n" +
        "\n" +
        "                          WELLS\n" +
        "          I guess I'd say... that he doesn't\n" +
        "           have a sense of humor. His name is\n" +
        "           Chigurh.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Sugar?\n" +
        "\n" +
        "                          WELLS\n" +
        "          Chigurh. Anton Chigurh. You know how\n" +
        "           he found you?\n" +
        "\n" +
        "                          MOSS\n" +
        "          I know how he found me.\n" +
        "\n" +
        "                          WELLS\n" +
        "          It's called a transponder.\n" +
        "\n" +
        "                          MOSS\n" +
        "          I know what it is. He won't find me\n" +
        "           again.\n" +
        "\n" +
        "                          WELLS\n" +
        "          Not that way.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Not any way.\n" +
        "\n" +
        "                          WELLS\n" +
        "          Took me about three hours.\n" +
        "\n" +
        "                          MOSS\n" +
        "          I been immobile.\n" +
        "\n" +
        "                          WELLS\n" +
        "          No. You don't understand.\n" +
        "          Wells sits back and studies Moss.\n" +
        "\n" +
        "                          WELLS\n" +
        "          ...What do you do?\n" +
        "\n" +
        "                          MOSS\n" +
        "          I'm retired.\n" +
        "\n" +
        "                          75\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          WELLS\n" +
        "          What did you do?\n" +
        "\n" +
        "                          MOSS\n" +
        "          I'm a welder.\n" +
        "\n" +
        "                          WELLS\n" +
        "          Acetylene? Mig? Tig?\n" +
        "\n" +
        "                          MOSS\n" +
        "          Any of it. If it can be welded I can\n" +
        "           weld it.\n" +
        "\n" +
        "                          WELLS\n" +
        "          Cast iron?\n" +
        "\n" +
        "                          MOSS\n" +
        "          Yes.\n" +
        "\n" +
        "                          WELLS\n" +
        "          I don't mean braze.\n" +
        "\n" +
        "                          MOSS\n" +
        "          I didn't say braze.\n" +
        "\n" +
        "                          WELLS\n" +
        "          Pot metal?\n" +
        "\n" +
        "                          MOSS\n" +
        "          What did I say?\n" +
        "\n" +
        "                          WELLS\n" +
        "          Were you in Nam?\n" +
        "\n" +
        "                          MOSS\n" +
        "          Yeah. I was in Nam.\n" +
        "\n" +
        "                          WELLS\n" +
        "          So was I.\n" +
        "\n" +
        "                          MOSS\n" +
        "          So what does that make me? Your buddy?\n" +
        "          Wells sits smiling at him.\n" +
        "          A beat.\n" +
        "\n" +
        "                          WELLS\n" +
        "          Look. You need to give me the money.\n" +
        "           I've got no other reason to protect\n" +
        "           you.\n" +
        "\n" +
        "                          76\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          MOSS\n" +
        "          Too late. I spent it -- about a\n" +
        "           million and a half on whores and\n" +
        "           whiskey and the rest of it I just\n" +
        "           sort of blew it in.\n" +
        "          Wells' smile stays in place.\n" +
        "\n" +
        "                          WELLS\n" +
        "          How do you know he's not on his way\n" +
        "           to Odessa?\n" +
        "          Moss stares at him. A beat.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Why would he go to Odessa?\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          WELLS\n" +
        "          To kill your wife.\n" +
        "          Another beat.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Maybe he should be worried. About\n" +
        "           me.\n" +
        "\n" +
        "                          WELLS\n" +
        "          He isn't. You're not cut out for\n" +
        "           this. You're just a guy that happened\n" +
        "           to find those vehicles.\n" +
        "          Moss doesn't respond.\n" +
        "\n" +
        "                          WELLS\n" +
        "          ...You didn't take the product, did\n" +
        "           you?\n" +
        "\n" +
        "                          MOSS\n" +
        "          What product.\n" +
        "\n" +
        "                          WELLS\n" +
        "          The heroin. You don't have it.\n" +
        "\n" +
        "                          MOSS\n" +
        "          No I don't have it.\n" +
        "\n" +
        "                          WELLS\n" +
        "          No. You don't.\n" +
        "          He rises.\n" +
        "\n" +
        "                          77\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          WELLS\n" +
        "          ...I'm across the river. At the Hotel\n" +
        "           Eagle. Carson Wells. Call me when\n" +
        "           you've had enough. I can even let\n" +
        "           you keep a little of the money.\n" +
        "\n" +
        "                          MOSS\n" +
        "          If I was cuttin' deals, why wouldn't\n" +
        "           I go deal with this guy Chigurh?\n" +
        "\n" +
        "                          WELLS\n" +
        "          No no. No. You don't understand. You\n" +
        "           can't make a deal with him. Even if\n" +
        "           you gave him the money he'd still\n" +
        "           kill you. He's a peculiar man. You\n" +
        "           could even say that he has principles.\n" +
        "           Principles that transcend money or\n" +
        "           drugs or anything like that. He's\n" +
        "           not like you. He's not even like me.\n" +
        "\n" +
        "                          MOSS\n" +
        "          He don't talk as much as you, I give\n" +
        "           him points for that.\n" +
        "\n" +
        "          INT. COFFEE SHOP - ODESSA - DAY\n" +
        "\n" +
        "          Sheriff Bell rises from a booth, taking off his hat.\n" +
        "\n" +
        "                          BELL\n" +
        "          Carla Jean, I thank you for comin'.\n" +
        "          She sits. He sits.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          Don't know why I did. I told you, I\n" +
        "           don't know where he is.\n" +
        "\n" +
        "                          BELL\n" +
        "          You ain't heard from him?\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          No I ain't.\n" +
        "\n" +
        "                          BELL\n" +
        "          Nothin'?\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          Not word one.\n" +
        "\n" +
        "                          BELL\n" +
        "          Would you tell me if you had?\n" +
        "\n" +
        "                          78\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          Well, I don't know. He don't need\n" +
        "           any trouble from you.\n" +
        "\n" +
        "                          BELL\n" +
        "          It's not me he's in trouble with.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          Who's he in trouble with then?\n" +
        "\n" +
        "                          BELL\n" +
        "          Some pretty bad people.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          Llewelyn can take care of hisself.\n" +
        "\n" +
        "                          BELL\n" +
        "          These people will kill him, Carla\n" +
        "           Jean. They won't quit.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          He won't neither. He never has.\n" +
        "\n" +
        "                          BELL\n" +
        "          I wish I could say that was in his\n" +
        "           favor. But I have to say I don't\n" +
        "           think it is.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          He can take all comers.\n" +
        "          Bell looks at her. After a beat:\n" +
        "\n" +
        "                          BELL\n" +
        "          You know Charlie Walser? Has the\n" +
        "           place east of Sanderson?\n" +
        "          She shakes her head, shrugs.\n" +
        "\n" +
        "                          BELL\n" +
        "          ...Well you know how they used to\n" +
        "           slaughter beeves, hit 'em with a\n" +
        "           maul right here to stun 'em...\n" +
        "          Indicates between his own eyes.\n" +
        "\n" +
        "                          79\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          BELL\n" +
        "          ...and then truss 'em up and slit\n" +
        "           their throats? Well here Charlie has\n" +
        "           one trussed up and all set to drain\n" +
        "           him and the beef comes to. It starts\n" +
        "           thrashing around, six hundred pounds\n" +
        "           of very pissed-off livestock if you'll\n" +
        "           pardon my... Charlie grabs his gun\n" +
        "           there to shoot the damn thing in the\n" +
        "           head but what with the swingin' and\n" +
        "           twistin' it's a glance-shot and\n" +
        "           ricochets around and comes back hits\n" +
        "           Charlie in the shoulder. You go see\n" +
        "           Charlie, he still can't reach up\n" +
        "           with his right hand for his hat...\n" +
        "           Point bein', even in the contest\n" +
        "           between man and cow the issue is not\n" +
        "           certain.\n" +
        "          He takes a sip of coffee, leaving room for Carla Jean to\n" +
        "          argue if inclined.\n" +
        "          She does not.\n" +
        "          Sheriff Bell hands a card across.\n" +
        "\n" +
        "                          BELL\n" +
        "          ...When Llewelyn calls, just tell\n" +
        "           him I can make him safe.\n" +
        "          She takes the card. Sheriff Bell sips.\n" +
        "\n" +
        "                          BELL\n" +
        "          ...Course, they slaughter beeves\n" +
        "           different now. Use a air gun. Shoots\n" +
        "           out a rod, about this far into the\n" +
        "           brain...\n" +
        "          He holds thumb and forefinger a couple inches apart.\n" +
        "\n" +
        "                          BELL\n" +
        "          ...Sucks back in. Animal never knows\n" +
        "           what hit him.\n" +
        "          Another beat. Carla Jean stares at him.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          Why you tellin' me that, Sheriff?\n" +
        "\n" +
        "                          BELL\n" +
        "          I don't know. My mind wanders.\n" +
        "\n" +
        "                          80\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "          EXT. RIO GRANDE BRIDGE - AFTERNOON\n" +
        "\n" +
        "          Late Day.\n" +
        "          Carson Wells grabs a light pole stanchion to hoist himself\n" +
        "          onto the guardrail. He stands atop it, eyeing the chain-link\n" +
        "          fence across the walkway.\n" +
        "          He climbs down and crosses to the fence and looks down:\n" +
        "          The brown, sluggish water of the Rio Grande.\n" +
        "\n" +
        "          LOOKING DOWN THE WALKWAY\n" +
        "         Carson Wells enters frame and recedes down the walkway.\n" +
        "          When he draws even with the next stanchion he looks down\n" +
        "          through the fence:\n" +
        "\n" +
        "                         \n" +
        "          Cane on the riverbank, and one gnarled tree.\n" +
        "\n" +
        "          INT. HOTEL EAGLE LOBBY - NIGHT\n" +
        "\n" +
        "          Twilight. Carson Wells enters the hotel and crosses the lobby.\n" +
        "\n" +
        "          INT. STAIRWAY - NIGHT\n" +
        "\n" +
        "          Carson Wells appears around the corner and we pull him as he\n" +
        "          mounts the stairs. When he is about halfway up a figure --\n" +
        "          focus does not hold him -- rounds the corner behind and\n" +
        "          silently follows, holding a fat-barreled shotgun loosely at\n" +
        "          his side.\n" +
        "          After a few steps Carson Wells stops, frowning, cued by we\n" +
        "          don't know what. Focus drops back as he turns. Chigurh raises\n" +
        "          the shotgun.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Hello Carson. Let's go to your room.\n" +
        "\n" +
        "          2ND HOTEL EAGLE ROOM - NIGHT\n" +
        "         Chigurh sits into a chair drawn up to face the armchair where\n" +
        "          Carson Wells sits.\n" +
        "\n" +
        "                          WELLS\n" +
        "          We don't have to do this. I'm a\n" +
        "           daytrader. I could just go home.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Why would I let you do that?\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          WELLS\n" +
        "          I know where the money is.\n" +
        "\n" +
        "                          81\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          CHIGURH\n" +
        "          If you knew, you would have it with\n" +
        "           you.\n" +
        "\n" +
        "                          WELLS\n" +
        "          I need dark. To get it. I know where\n" +
        "           it is.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          I know something better.\n" +
        "\n" +
        "                          WELLS\n" +
        "          What's that.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          I know where it's going to be.\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          WELLS\n" +
        "          And where is that.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          It will be brought to me and placed\n" +
        "           at my feet.\n" +
        "          Wells wipes his mouth with his hand.\n" +
        "\n" +
        "                          WELLS\n" +
        "          You don't know to a certainty. Twenty\n" +
        "           minutes it could be here.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          I do know to a certainty. And you\n" +
        "           know what's going to happen now. You\n" +
        "           should admit your situation. There\n" +
        "           would be more dignity in it.\n" +
        "\n" +
        "                          WELLS\n" +
        "          You go to hell.\n" +
        "          A beat.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Let me ask you something. If the\n" +
        "           rule you followed brought you to\n" +
        "           this, of what use was the rule?\n" +
        "          Another beat.\n" +
        "\n" +
        "                          WELLS\n" +
        "          Do you have any idea how goddamn\n" +
        "           crazy you are?\n" +
        "\n" +
        "                          82\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          CHIGURH\n" +
        "          You mean the nature of this\n" +
        "           conversation?\n" +
        "\n" +
        "                          WELLS\n" +
        "          I mean the nature of you.\n" +
        "          Chigurh looks at him equably. Wells holds his look.\n" +
        "\n" +
        "                          WELLS\n" +
        "          ...You can have the money. Anton.\n" +
        "          The phone rings.\n" +
        "          Wells looks at the phone. Chigurh hasn't moved.\n" +
        "          Wells looks at Chigurh, waiting for a decision.\n" +
        "\n" +
        "                         \n" +
        "          The low chug of the shotgun.\n" +
        "          Aside from his finger on the trigger, Chigurh hasn't moved.\n" +
        "          He sits staring at Wells's remains for a beat.\n" +
        "          Now his look swings onto the phone. He watches it ring twice\n" +
        "          more.\n" +
        "          He picks it up and listens without speaking.\n" +
        "          After a beat:\n" +
        "\n" +
        "                          MOSS'S VOICE\n" +
        "          ...Hello?\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Yes?\n" +
        "          Another beat.\n" +
        "\n" +
        "                          MOSS'S VOICE\n" +
        "          Is Carson Wells there.\n" +
        "          A longer beat.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Not in the sense that you mean.\n" +
        "          Moss doesn't answer. Chigurh gives him a beat, and then:\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          ...You need to come see me.\n" +
        "\n" +
        "                          83\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "          MEXICAN HOSPITAL WARD - NIGHT\n" +
        "         We intercut Moss, in his hospital robe, at a public phone on\n" +
        "          the ward. He stands tensed with the phone to his ear. Finally:\n" +
        "\n" +
        "                          MOSS\n" +
        "          Who is this.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          You know who it is.\n" +
        "          A beat.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          ...You need to talk to me.\n" +
        "\n" +
        "                          MOSS\n" +
        "          I don't need to talk to you.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          I think that you do. Do you know\n" +
        "           where I'm going?\n" +
        "\n" +
        "                          MOSS\n" +
        "          Why would I care where you're going.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Do you know where I'm going?\n" +
        "          No answer.\n" +
        "\n" +
        "          INT. 2ND HOTEL EAGLE ROOM - NIGHT\n" +
        "\n" +
        "          Chigurh cocks his head, noticing something on the floor. He\n" +
        "          adjusts to sit back and raise his boots onto the bed.\n" +
        "          On the floor where his feet were, blood is pooling out from\n" +
        "          Wells's chair.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          ...I know where you are.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Yeah? Where am I?\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          You're in the hospital across the\n" +
        "           river. But that's not where I'm going.\n" +
        "           Do you know where I'm going?\n" +
        "\n" +
        "                          MOSS\n" +
        "          Yeah. I know where you're going.\n" +
        "\n" +
        "                          84\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          CHIGURH\n" +
        "          All right.\n" +
        "\n" +
        "                          MOSS\n" +
        "          You know she won't be there.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          It doesn't make any difference where\n" +
        "           she is.\n" +
        "\n" +
        "                          MOSS\n" +
        "          So what're you goin' up there for.\n" +
        "          A beat.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          You know how this is going to turn\n" +
        "           out, don't you?\n" +
        "\n" +
        "                          MOSS\n" +
        "          No. Do you?\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Yes, I do. I think you do too. So\n" +
        "           this is what I'll offer. You bring\n" +
        "           me the money and I'll let her go.\n" +
        "           Otherwise she's accountable. The\n" +
        "           same as you. That's the best deal\n" +
        "           you're going to get. I won't tell\n" +
        "           you you can save yourself because\n" +
        "           you can't.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Yeah I'm goin' to bring you somethin'\n" +
        "           all right. I've decided to make you\n" +
        "           a special project of mine. You ain't\n" +
        "           goin' to have to look for me at all.\n" +
        "          Moss slams the phone onto its hook, then slams it twice more\n" +
        "          for good measure.\n" +
        "          Chigurh, in the hotel room, cradles his phone.\n" +
        "\n" +
        "          INT. COFFEE SHOP - DAY\n" +
        "\n" +
        "          Sheriff Bell sits at his usual booth, but with an unaccustomed\n" +
        "          look: reading glasses. He has been looking at a newspaper\n" +
        "          but is now peering over his glasses up at Wendell who\n" +
        "          apparently interrupted his reading.\n" +
        "\n" +
        "                          BELL\n" +
        "          The motel in Del Rio?\n" +
        "          Wendell nods.\n" +
        "\n" +
        "                          85\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          WENDELL\n" +
        "          Yessir. None of the three had ID on\n" +
        "           'em but they're tellin' me all three\n" +
        "           is Mexicans. Was Mexicans.\n" +
        "\n" +
        "                          BELL\n" +
        "          There's a question. Whether they\n" +
        "           stopped bein'. And when.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          Yessir.\n" +
        "\n" +
        "                          BELL\n" +
        "          Now, Wendell, did you inquire about\n" +
        "           the cylinder lock?\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          WENDELL\n" +
        "          Yessir. It was punched out.\n" +
        "\n" +
        "                          BELL\n" +
        "          Okay.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          You gonna drive out there?\n" +
        "\n" +
        "                          BELL\n" +
        "          No, that's the only thing I would've\n" +
        "           looked for. And it sounds like these\n" +
        "           boys died of natural causes.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          How's that, Sheriff?\n" +
        "\n" +
        "                          BELL\n" +
        "          Natural to the line of work they was\n" +
        "           in.\n" +
        "\n" +
        "                          WENDELL\n" +
        "          Yessir.\n" +
        "\n" +
        "                          BELL\n" +
        "          My lord, Wendell, it's just all-out\n" +
        "           war. I don't know any other word\n" +
        "           for it. Who are these folks? I don't\n" +
        "           know...\n" +
        "          He rattles the paper.\n" +
        "\n" +
        "                          86\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          BELL\n" +
        "          ...Here last week they found this\n" +
        "           couple out in California they would\n" +
        "           rent out rooms to old people and\n" +
        "           then kill em and bury em in the yard\n" +
        "           and cash their social security checks.\n" +
        "           They'd torture em first, I don't\n" +
        "           know why. Maybe their television set\n" +
        "           was broke. And this went on until,\n" +
        "           and here I quote...\n" +
        "          He looks through his glasses at the paper.\n" +
        "\n" +
        "                          BELL\n" +
        "          ...\"Neighbors were alerted when a\n" +
        "           man ran from the premises wearing\n" +
        "           only a dog collar.\" You can't make\n" +
        "           up such a thing as that. I dare you\n" +
        "           to even try.\n" +
        "          He peers over his glasses at Wendell who respectfully shakes\n" +
        "          his head and tsks.\n" +
        "          Sheriff Bell rattles the paper again.\n" +
        "\n" +
        "                          BELL\n" +
        "          ...But that's what it took, you'll\n" +
        "           notice. Get someone's attention.\n" +
        "           Diggin graves in the back yard didn't\n" +
        "           bring any.\n" +
        "          Wendell bites back a smile. Sheriff Bell gazes at him over\n" +
        "          his glasses for a long beat, deadpan.\n" +
        "\n" +
        "                          BELL\n" +
        "          ...That's all right. I laugh myself\n" +
        "           sometimes.\n" +
        "          He goes back to the paper.\n" +
        "\n" +
        "                          BELL\n" +
        "          ...There ain't a whole lot else you\n" +
        "           can do.\n" +
        "\n" +
        "          EXT. BORDER SHACK - DAY\n" +
        "\n" +
        "          Moss, a coat thrown over his hospital robe, is standing before\n" +
        "          a uniformed INS official on the Rio Grande bridge.\n" +
        "          The official, who looks like a marine drill instructor, is\n" +
        "          chewing. He chews for a long beat, staring at Moss.\n" +
        "\n" +
        "                         \n" +
        "          He finally spits tobacco juice and pats his lower lip with a\n" +
        "          handkerchief.\n" +
        "\n" +
        "                          87\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          OFFICIAL\n" +
        "         Who do you think gets through this\n" +
        "          gate into the United States of\n" +
        "          America?\n" +
        "\n" +
        "                          MOSS\n" +
        "         I don't know. American citizens.\n" +
        "\n" +
        "                          OFFICIAL\n" +
        "         Some American citizens. Who do you\n" +
        "          think decides?\n" +
        "\n" +
        "                          MOSS\n" +
        "         You do, I reckon.\n" +
        "\n" +
        "                          OFFICIAL\n" +
        "         That is correct. And how do I decide?\n" +
        "\n" +
        "                          MOSS\n" +
        "         I don't know.\n" +
        "\n" +
        "                          OFFICIAL\n" +
        "         I ask questions. If I get sensible\n" +
        "          answers then they get to go to\n" +
        "          America. If I don't get sensible\n" +
        "          answers they don't. Is there anything\n" +
        "          about that that you don't understand?\n" +
        "\n" +
        "                          MOSS\n" +
        "         No sir.\n" +
        "\n" +
        "                          OFFICIAL\n" +
        "         Then I ask you again how you come to\n" +
        "          be out here with no clothes.\n" +
        "\n" +
        "                          MOSS\n" +
        "         I got an overcoat on.\n" +
        "\n" +
        "                          OFFICIAL\n" +
        "         Are you jackin' with me?\n" +
        "\n" +
        "                          MOSS\n" +
        "         No sir.\n" +
        "\n" +
        "                          OFFICIAL\n" +
        "         Don't jack with me.\n" +
        "\n" +
        "                          MOSS\n" +
        "         Yes sir.\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          OFFICIAL\n" +
        "         Are you in the service?\n" +
        "\n" +
        "                          88\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          MOSS\n" +
        "          No sir. I'm a veteran.\n" +
        "\n" +
        "                          OFFICIAL\n" +
        "          Nam?\n" +
        "\n" +
        "                          MOSS\n" +
        "          Yes sir. Two tours.\n" +
        "\n" +
        "                          OFFICIAL\n" +
        "          What outfit.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Twelfth Infantry Batallion. August\n" +
        "           seventh nineteen and sixty-six to\n" +
        "           July second nineteen and sixty-eight.\n" +
        "\n" +
        "                         \n" +
        "          The official stares at him, chewing, sour.\n" +
        "\n" +
        "                          OFFICIAL\n" +
        "          Wilson!\n" +
        "\n" +
        "                          GUARD\n" +
        "          Yessir.\n" +
        "\n" +
        "                          OFFICIAL\n" +
        "          Get someone to help this man. He\n" +
        "           needs to get into town.\n" +
        "\n" +
        "          INT. GENERAL STORE - DAY\n" +
        "\n" +
        "          The clerk who earlier sold him the boots:\n" +
        "\n" +
        "                          CLERK\n" +
        "          How those Larries holdin' up?\n" +
        "          Moss is walking up in his boots and overcoat and hospital\n" +
        "          robe.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Good. I need everything else.\n" +
        "\n" +
        "                          CLERK\n" +
        "          Okay.\n" +
        "\n" +
        "                          MOSS\n" +
        "          You get a lot of people come in here\n" +
        "           with no clothes on?\n" +
        "\n" +
        "                          CLERK\n" +
        "          No sir, it's unusual.\n" +
        "\n" +
        "                          89\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "          EXT. RIVER BANK - DAY\n" +
        "\n" +
        "          We are looking across the Rio Grande. Moss appears over the\n" +
        "          near edge of the river bank, newly clothed, and holding the\n" +
        "          document case.\n" +
        "          As he reaches the top of the bank he frowns and twists his\n" +
        "          neck, responding to an irritation. He feels around with his\n" +
        "          free hand inside the back of the shirt collar. A sharp yank.\n" +
        "          His hand comes away with a small tag.\n" +
        "\n" +
        "          INT. GREYHOUND STATION - DEL RIO - DAY\n" +
        "\n" +
        "          The document case is resting on a small foreground counter.\n" +
        "          Moss is at a pay phone, one hand holding the phone to his\n" +
        "          ear, the other resting on the case.\n" +
        "          The voice on the phone is old, female, and querulous:\n" +
        "\n" +
        "                          VOICE\n" +
        "          She don't want to talk to you.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Yes she does. Put her on.\n" +
        "\n" +
        "                          VOICE\n" +
        "          Do you know what time it is?\n" +
        "\n" +
        "                          MOSS\n" +
        "          I don't care what time it is. Don't\n" +
        "           you hang up this phone.\n" +
        "\n" +
        "                          VOICE\n" +
        "          I told her what was going to happen,\n" +
        "           didn't I. Chapter and verse. I said:\n" +
        "           This is what will come to pass. And\n" +
        "           now it has come to pass --\n" +
        "          Scuffing sounds, a sharp \"Mama!\", and then, into the phone:\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          Llewelyn?\n" +
        "\n" +
        "                          MOSS\n" +
        "          Hey.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          What should I do?\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          MOSS\n" +
        "          You know what's goin' on?\n" +
        "\n" +
        "                          90\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "         I don't know, I had the sheriff here\n" +
        "          from Terrell County --\n" +
        "\n" +
        "                          MOSS\n" +
        "         What did you tell him?\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "         What did I know to tell him. You're\n" +
        "          hurt, ain't you?\n" +
        "\n" +
        "                          MOSS\n" +
        "         What makes you say that?\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "         I can hear it in your voice.\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          MOTHER\n" +
        "\n" +
        "                          (DISTANT)\n" +
        "         There is falseness in his voice!\n" +
        "\n" +
        "                          MOSS\n" +
        "         Meet me at the Heart of Texas motel\n" +
        "          in El Paso. I'm gonna give you the\n" +
        "          money and put you on a plane.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "         Llewelyn, I ain't gonna leave you in\n" +
        "          the lurch.\n" +
        "\n" +
        "                          MOSS\n" +
        "         No. This works better. With you gone\n" +
        "          and I don't have the money, he can't\n" +
        "          touch me. But I can sure touch him.\n" +
        "          After I find him I'll come and join\n" +
        "          you.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "         Find who? What am I supposed to do\n" +
        "          with Mother?\n" +
        "\n" +
        "                          MOSS\n" +
        "         She'll be all right.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "         She'll be all right?\n" +
        "\n" +
        "                          MOTHER\n" +
        "\n" +
        "                          (DISTANT)\n" +
        "         Be all right! I've got the cancer!\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          MOSS\n" +
        "         I don't think anybody'll bother her.\n" +
        "\n" +
        "                          91\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "          OFFICE HALLWAY - DAY\n" +
        "\n" +
        "          A LOCK CYLINDER\n" +
        "         It blows in. The hole shows a brightly lit cinderblock wall\n" +
        "          behind.\n" +
        "          The door swings open and the air tank is swung in and\n" +
        "          deposited on carpet.\n" +
        "          Wider: Chigurh enters the carpeted hallway from the\n" +
        "          cinderblock stairwell, holding the tricked-out shotgun.\n" +
        "          The hallway is white wallboard, doors opening off it at long\n" +
        "          intervals. Chigurh stands still and listens. Nothing but the\n" +
        "          hum of ventilation.\n" +
        "\n" +
        "                         \n" +
        "          He walks quietly to the one open door twenty feet away.\n" +
        "\n" +
        "          INT. OFFICE - DAY\n" +
        "\n" +
        "          He enters.\n" +
        "          The man who hired Carson Wells is behind his desk, in front\n" +
        "          of the floor-to-ceiling windows. He looks up from papers,\n" +
        "          slipping off his reading glasses. On seeing the shotgun he\n" +
        "          opens a desk drawer and starts to rise.\n" +
        "          Chung -- the shotgun blast knocks him back. Shot pits but\n" +
        "          doesn't break the window.\n" +
        "          A man in a suit rises and turns from the chair opposite the\n" +
        "          desk, very slowly, as if to advertise that he is not a threat.\n" +
        "          Chigurh ignores him and rounds the desk to look at the man\n" +
        "          gurgling on the floor.\n" +
        "          After a beat, still looking down at the man he has shot:\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Who are you?\n" +
        "          A long beat.\n" +
        "\n" +
        "           MAN AT CHAIR\n" +
        "          ...Me?\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Yes.\n" +
        "\n" +
        "           MAN AT CHAIR\n" +
        "          Nobody. Accounting.\n" +
        "          Chigurh finally looks up at him.\n" +
        "\n" +
        "                          92\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          CHIGURH\n" +
        "          He gave Acosta's people a receiver.\n" +
        "\n" +
        "           MAN AT CHAIR\n" +
        "          He feels... he felt... the more people\n" +
        "           looking...\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          That's foolish. You pick the one\n" +
        "           right tool.\n" +
        "          Chigurh inclines his head toward the pocked glass of the\n" +
        "          picture window.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          ...For instance. I used birshot. So\n" +
        "           as not to blow the window.\n" +
        "\n" +
        "           MAN AT CHAIR\n" +
        "          I see.\n" +
        "          He still has not moved, one hand still touching the armrest.\n" +
        "\n" +
        "           MAN AT CHAIR\n" +
        "          ...Are you going to shoot me?\n" +
        "          Chigurh looks at him.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          That depends. Do you see me?\n" +
        "          The man stares at him for a beat.\n" +
        "\n" +
        "           MAN AT CHAIR\n" +
        "          No.\n" +
        "\n" +
        "          INT. CAB - ODESSA - DAY\n" +
        "\n" +
        "\n" +
        "          EYES IN A REAR-VIEW MIRROR\n" +
        "         Eyes in a weathered face shift back and forth between road\n" +
        "          and mirror, where they give nodding acknowledgment to the\n" +
        "          passenger.\n" +
        "\n" +
        "                          MOTHER'S VOICE\n" +
        "          And I always seen this is what it\n" +
        "           would come to. Three years ago I pre-\n" +
        "           visioned it.\n" +
        "          Wider shows Carla Jean and her mother in the back of the\n" +
        "          moving cab.\n" +
        "\n" +
        "                          93\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          It ain't even three years we been\n" +
        "           married.\n" +
        "\n" +
        "                          MOTHER\n" +
        "          Three years ago I said them very\n" +
        "           words. No and Good.\n" +
        "\n" +
        "                          DRIVER\n" +
        "          Yes ma'am.\n" +
        "\n" +
        "                          MOTHER\n" +
        "          Now here we are. Ninety degree heat.\n" +
        "           I got the cancer. And look at this.\n" +
        "           Not even a home to go to.\n" +
        "\n" +
        "                          DRIVER\n" +
        "          Yes ma'am.\n" +
        "\n" +
        "                          MOTHER\n" +
        "          We're goin' to El Paso Texas. You\n" +
        "           know how many people I know in El\n" +
        "           Paso Texas?\n" +
        "\n" +
        "                          DRIVER\n" +
        "          No ma'am.\n" +
        "          She holds up thumb and forefinger curled to make an 0.\n" +
        "\n" +
        "                          MOTHER\n" +
        "          That's how many. Ninety degree heat.\n" +
        "\n" +
        "          EXT. BUS STATION - ODESSA - DAY\n" +
        "\n" +
        "          The cab is stopped outside the depot. Carla Jean and her\n" +
        "          mother and the driver are at the trunk struggling over bags.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          I got it Mama.\n" +
        "\n" +
        "                          MOTHER\n" +
        "          I didn't see my Prednizone.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          I put it in, Mama.\n" +
        "\n" +
        "                          MOTHER\n" +
        "          Well I didn't see it.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          Well I put it in. That one. You just\n" +
        "           set there. I'll get tickets and a\n" +
        "           cart for the bags.\n" +
        "\n" +
        "                          94\n" +
        "\n" +
        "                         \n" +
        "          As Carla Jean goes to the station a man emerges from a car\n" +
        "          pulled up behind. He is a well-dressed Mexican of early middle\n" +
        "          age.\n" +
        "\n" +
        "                          MEXICAN\n" +
        "          Do you need help with the bags, madam?\n" +
        "\n" +
        "                          MOTHER\n" +
        "          Well thank god there's one gentleman\n" +
        "           left in West Texas. Yes thank you. I\n" +
        "           am old and I am not well.\n" +
        "\n" +
        "                          MEXICAN\n" +
        "          Which bus are you taking?\n" +
        "\n" +
        "                          MOTHER\n" +
        "          We're going to El Paso, don't ask me\n" +
        "           why. Discombobulated by a no-account\n" +
        "           son-in-law. Thank you. You don't\n" +
        "           often see a Mexican in a suit.\n" +
        "\n" +
        "                          MEXICAN\n" +
        "          You go to El Paso? I know it. Where\n" +
        "           are you staying?\n" +
        "\n" +
        "          INT. BUS STATION - DAY\n" +
        "\n" +
        "          Carla Jean is at a phone booth.\n" +
        "          After a short wait, a pickup and a filtered:\n" +
        "\n" +
        "                          SHERIFF BELL\n" +
        "          Carla Jean, how are you.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          Sheriff, was that a true story about\n" +
        "           Charlie Walser?\n" +
        "\n" +
        "                          BELL\n" +
        "          Who's Charlie Walser. Oh! Well, I,\n" +
        "           uh... True story? I couldn't swear\n" +
        "           to ever detail but... it's certainly\n" +
        "           true that it is a story.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          Yeah, right. Sheriff, can you give\n" +
        "           me your word on somethin'?\n" +
        "\n" +
        "          SHERIFF BELL'S OFFICE - DAY\n" +
        "         We intercut Sheriff Bell in his office.\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          BELL\n" +
        "          Yes ma'am?\n" +
        "\n" +
        "                          95\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          If I tell you where Llewelyn's headed,\n" +
        "           you promise it'll be just you goes\n" +
        "           and talks with him -- you and nobody\n" +
        "           else?\n" +
        "\n" +
        "                          BELL\n" +
        "          Yes ma'am, I do.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          Llewelyn would never ask for help.\n" +
        "           He never thinks he needs any.\n" +
        "\n" +
        "                          BELL\n" +
        "          Carla Jean, I will not harm your\n" +
        "           man. And he needs help, whether he\n" +
        "           knows it or not.\n" +
        "\n" +
        "          EXT. ROAD - DAY\n" +
        "\n" +
        "\n" +
        "                         CHIGURH\n" +
        "         A driving point-of-view approaching Chigurh, who leans against\n" +
        "          his Ramcharger, its hood up, stopped on the shoulder on the\n" +
        "          opposite side of the road.\n" +
        "          Reverse shows a man in an El Camino. Chickens in stacked\n" +
        "          cages squawk and flutter in the bed.\n" +
        "          The man slows and rolls his window down to lean out.\n" +
        "\n" +
        "                          MAN\n" +
        "          What's the problem there, neighbor.\n" +
        "\n" +
        "                         MINUTES LATER\n" +
        "         The man has pulled his vehicle over nose-to-nose with\n" +
        "          Chigurh's. He is rummaging in the car behind the seat. His\n" +
        "          voice comes out muffled:\n" +
        "\n" +
        "                          MAN\n" +
        "          Yeah, that'll suck some power. Over\n" +
        "           time.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          You from around here?\n" +
        "          The man emerges with jumper cables.\n" +
        "\n" +
        "                          MAN\n" +
        "          Alpine. Born 'n bred. Here ya go.\n" +
        "          He hands one pair of leads to Chigurh.\n" +
        "\n" +
        "                          96\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          CHIGURH\n" +
        "          What airport would you use.\n" +
        "\n" +
        "                          MAN\n" +
        "          Huh? Airport or airstrip?\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Airport.\n" +
        "\n" +
        "                          MAN\n" +
        "          Well -- where ya goin'?\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          I don't know.\n" +
        "\n" +
        "                          MAN\n" +
        "          Just lightin' out for the territories,\n" +
        "           huh. Brother, I been there... Well...\n" +
        "          He takes off his hat and draws a sleeve across his brow,\n" +
        "          thinking.\n" +
        "\n" +
        "                          MAN\n" +
        "          ...There's airstrips.\n" +
        "          He turns with his pair of leads to clamp them onto his\n" +
        "          battery. On his back:\n" +
        "\n" +
        "                          MAN\n" +
        "          ...The airport is El Paso. You want\n" +
        "           some place specific you might could\n" +
        "           be better off just drivin' to Dallas.\n" +
        "           Not have to connect.\n" +
        "          He turns back around to face Chigurh who stands there, still\n" +
        "          holding his pair of leads.\n" +
        "\n" +
        "                          MAN\n" +
        "          ...You gonna clamp them, buddy?\n" +
        "          Chigurh is looking at him blandly.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Can you get those chicken crates out\n" +
        "           of the bed.\n" +
        "          The man stares at him.\n" +
        "\n" +
        "                          MAN\n" +
        "          What're you talkin' about?\n" +
        "\n" +
        "                          97\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "          EXT. CAR WASH - DAY\n" +
        "\n" +
        "\n" +
        "                         COIN SLOT\n" +
        "         Quarters are fed in. Wider as Chigurh unholsters the wand at\n" +
        "          a self-service car wash.\n" +
        "          He sprays the spatter-pattern rust-colored stain off the\n" +
        "          roof of the cab of the El Camino.\n" +
        "          Water drums as he sprays chicken feathers out of the bed.\n" +
        "\n" +
        "          EXT. MOTEL - EL PASO - DAY\n" +
        "\n" +
        "          Moss is turning the key in his room door, a new vinyl gun\n" +
        "          bag slung over his shoulder.\n" +
        "\n" +
        "                         \n" +
        "          At the cut the roar of a plane climbing overhead recedes.\n" +
        "          Out of it, a voice:\n" +
        "\n" +
        "                          WOMAN\n" +
        "          Hey Mr. Sporting Goods.\n" +
        "          Moss looks.\n" +
        "          A woman sunbathes at the central court swimming pool. A lot\n" +
        "          of hard light.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Hey yourself.\n" +
        "          The woman is pretty in a roadhouse-veteran sort of way. Her\n" +
        "          voice carries a flat echo, slapping off the surface of the\n" +
        "          pool.\n" +
        "\n" +
        "                          WOMAN\n" +
        "          You a sport?\n" +
        "          Moss slings the bag into the room onto the bed and then turn\n" +
        "          and leans against a veranda post.\n" +
        "\n" +
        "                          MOSS\n" +
        "          That's me.\n" +
        "\n" +
        "                          WOMAN\n" +
        "          I got beers in my room.\n" +
        "          Moss holds up his left hand to show the ring.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Waitin' for my wife.\n" +
        "\n" +
        "                          98\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          WOMAN\n" +
        "          Oh. That's who you keep lookin' out\n" +
        "           the window for?\n" +
        "\n" +
        "                          MOSS\n" +
        "          Half.\n" +
        "\n" +
        "                          WOMAN\n" +
        "          What else then?\n" +
        "\n" +
        "                          MOSS\n" +
        "          Lookin' for what's comin'.\n" +
        "\n" +
        "                          WOMAN\n" +
        "          Yeah but no one ever sees that. I\n" +
        "           like a man that'll tell you he's\n" +
        "           married.\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          MOSS\n" +
        "          Then you'll like me.\n" +
        "\n" +
        "                          WOMAN\n" +
        "          I do like you.\n" +
        "          A beat. Lapping water.\n" +
        "\n" +
        "                          WOMAN\n" +
        "          ...Beer. That's what's comin', I'll\n" +
        "           bring the ice chest out here. You\n" +
        "           can stay married.\n" +
        "          Building jet roar from another climbing plane.\n" +
        "\n" +
        "                          MOSS\n" +
        "          Ma'am I know what beer leads to.\n" +
        "          The woman laughs. Before the plane overwhelms it:\n" +
        "\n" +
        "                          WOMAN\n" +
        "          Beer leads to more beer.\n" +
        "\n" +
        "          INT. SHERIFF BELL'S CRUISER - DAY\n" +
        "\n" +
        "\n" +
        "                         SHERIFF BELL\n" +
        "         Driving.\n" +
        "          As he drives he refers to one side of the road, a commercial\n" +
        "          strip, looking for something. We hear the fading roar of a\n" +
        "          large airplane.\n" +
        "\n" +
        "                         \n" +
        "          The tock tock of distant gunfire brings his look around. A\n" +
        "          beat. Another tock. The chatter of machine-gun fire. Another\n" +
        "          single shot.\n" +
        "\n" +
        "                          99\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "          Sheriff Bell stamps the accelerator and hits his siren.\n" +
        "\n" +
        "          EXT. MOTEL STREET - DAY\n" +
        "\n" +
        "          Point-of-view racing toward the motel: a pickup with a rack\n" +
        "          of roof lights roars out. Tire squeals, machine-gun chatter\n" +
        "          and dog barks. The truck turns toward us, then slews around\n" +
        "          and speeds away, fishtailing.\n" +
        "\n" +
        "          EXT. MOTEL COURTYARD - DAY\n" +
        "\n" +
        "          Point-of-view turning into the central court: a man is\n" +
        "          crawling on his belly along the veranda toward the street.\n" +
        "          Sheriff Bell skids to a halt and gets out. We hear screams,\n" +
        "          a child crying.\n" +
        "\n" +
        "                         \n" +
        "          Sheriff Bell jogs toward the crawling man, one hand on his\n" +
        "          holstered gun.\n" +
        "          Behind the man on the veranda is his abandoned machine pistol.\n" +
        "          He is a Mexican in a guyabera.\n" +
        "          Sheriff Bell yells at a scared face in a cracked door:\n" +
        "\n" +
        "                          BELL\n" +
        "          Call police.\n" +
        "          He is still jogging. A glance to the side:\n" +
        "          Rough point-of-view of a woman's body, belly-down at the lip\n" +
        "          of the pool, head and upper torso in the water.\n" +
        "          Rough point-of-view forward: an open room door. Booted feet\n" +
        "          stick out.\n" +
        "          Sheriff Bell arrives. Moss is face-up, mostly inside the\n" +
        "          room. The new gun bag is next to him. The gun is in hand.\n" +
        "          He is still.\n" +
        "          Voices. Sheriff Bell glances off.\n" +
        "\n" +
        "                          BELL\n" +
        "          ...Call your local law enforcement.\n" +
        "           I'm not on their radio.\n" +
        "\n" +
        "          EXT. MOTEL - NIGHT\n" +
        "\n" +
        "          Night. The entrance is blocked by police vehicles.\n" +
        "\n" +
        "                         \n" +
        "          People stand around in knots. Sheriff Bell is talking to the\n" +
        "          local sheriff. A door slam attracts his look.\n" +
        "\n" +
        "                          100\n" +
        "\n" +
        "                         \n" +
        "          Carla Jean has gotten out of the far side of a cab. On the\n" +
        "          near side the driver is leaning in to help her mother out.\n" +
        "          After a couple of rocking attempts she has enough inertia to\n" +
        "          come to her feet outside the vehicle.\n" +
        "          Carla Jean is advancing slowly toward Sheriff Bell, taking\n" +
        "          in the scene.\n" +
        "          Sheriff Bell steps toward her.\n" +
        "          Her eyes track his hand as he raises it to his hat. He takes\n" +
        "          it off.\n" +
        "\n" +
        "                          BELL\n" +
        "          Carla Jean...\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          No.\n" +
        "\n" +
        "          INT. HOSPITAL/MORGUE - NIGHT\n" +
        "\n" +
        "          Looking down a long corridor flanked by a wall of stainless\n" +
        "          steel drawers. At the far end stands Bell, hat in hand,\n" +
        "          staring down into an open drawer just in front of him. A\n" +
        "          long beat.\n" +
        "\n" +
        "          EXT. HOSPITAL / MORGUE - NIGHT\n" +
        "\n" +
        "          The local sheriff, Roscoe Giddins, stands smoking under the\n" +
        "          port cochere in front of the hospital. Sheriff Bell emerges\n" +
        "          from the building.\n" +
        "          A long beat.\n" +
        "\n" +
        "                          BELL\n" +
        "          I don't know who she is.\n" +
        "          He puts his hat back on.\n" +
        "\n" +
        "                          ROSCOE\n" +
        "          I thought maybe she was with your\n" +
        "           boy there.\n" +
        "\n" +
        "                          BELL\n" +
        "          No ID in her room?\n" +
        "\n" +
        "                          ROSCOE\n" +
        "          Not hardly nothin' in her room. And\n" +
        "           that establishment was no stickler\n" +
        "           on registration. Well...\n" +
        "\n" +
        "                         \n" +
        "          The two men start walking.\n" +
        "\n" +
        "                          101\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          ROSCOE\n" +
        "          ...County'll bury her. Here Lies\n" +
        "           Female, Unknown. Her Number Was Up.\n" +
        "          A walking beat.\n" +
        "\n" +
        "                          ROSCOE\n" +
        "          ...Buy you a cup of coffee before\n" +
        "           you drive home?\n" +
        "\n" +
        "          COFFEE SHOP - EL PASO - NIGHT\n" +
        "         Roscoe and Sheriff Bell face each other over coffee.\n" +
        "\n" +
        "                          BELL\n" +
        "          No money in his room there?\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          ROSCOE\n" +
        "          Couple hundred on his person. Those\n" +
        "           hombres would've taken the stash.\n" +
        "\n" +
        "                          BELL\n" +
        "          I suppose. Though they was leavin'\n" +
        "           in a hurry.\n" +
        "\n" +
        "                          ROSCOE\n" +
        "          It's all the goddamned money, Ed\n" +
        "           Tom. The money and the drugs. It's\n" +
        "           just goddamned beyond everything.\n" +
        "           What is it mean? What is it leading\n" +
        "           to?\n" +
        "\n" +
        "                          BELL\n" +
        "          Yes.\n" +
        "\n" +
        "                          ROSCOE\n" +
        "          If you'd a told me twenty years ago\n" +
        "           I'd see children walkin' the streets\n" +
        "           of our Texas towns with green hair\n" +
        "           and bones in their noses I just flat\n" +
        "           out wouldn't of believed you.\n" +
        "\n" +
        "                          BELL\n" +
        "          Signs and wonders. But I think once\n" +
        "           you stop hearin' sir and madam the\n" +
        "           rest is soon to follow.\n" +
        "\n" +
        "                          ROSCOE\n" +
        "          It's the tide. It's the dismal tide.\n" +
        "           It is not the one thing.\n" +
        "\n" +
        "                          102\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          BELL\n" +
        "          Not the one thing. I used to think I\n" +
        "           could at least some way put things\n" +
        "           right. I don't feel that way no more.\n" +
        "          A beat.\n" +
        "\n" +
        "                          BELL\n" +
        "          ...I don't know what I do feel like.\n" +
        "\n" +
        "                          ROSCOE\n" +
        "          Try \"old\" on for size.\n" +
        "\n" +
        "                          BELL\n" +
        "          Yessir. It may be that. In a nutshell.\n" +
        "\n" +
        "          EXT. COFFEE SHOP PARKING LOT - NIGHT\n" +
        "\n" +
        "\n" +
        "                         \n" +
        "          The two men are walking out.\n" +
        "\n" +
        "                          ROSCOE\n" +
        "          None of that explains your man though.\n" +
        "\n" +
        "                          BELL\n" +
        "          Uh-huh.\n" +
        "\n" +
        "                          ROSCOE\n" +
        "          He is just a goddamn homicidal\n" +
        "           lunatic, Ed Tom.\n" +
        "\n" +
        "                          BELL\n" +
        "          I'm not sure he's a lunatic.\n" +
        "\n" +
        "                          ROSCOE\n" +
        "          Well what would you call him.\n" +
        "\n" +
        "                          BELL\n" +
        "          I don't know. Sometimes I think he's\n" +
        "           pretty much a ghost.\n" +
        "\n" +
        "                          ROSCOE\n" +
        "          He's real all right.\n" +
        "\n" +
        "                          BELL\n" +
        "          Oh yes.\n" +
        "\n" +
        "                          ROSCOE\n" +
        "          All that at the Eagle Hotel. It's\n" +
        "           beyond everything.\n" +
        "\n" +
        "                          BELL\n" +
        "          Yes, he has some hard bark on him.\n" +
        "\n" +
        "                          103\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          ROSCOE\n" +
        "          That don't hardly say it. He shoots\n" +
        "           the desk clerk one day, and walks\n" +
        "           right back in the next and shoots a\n" +
        "           retired army colonel.\n" +
        "          They have reached Sheriff Bell's cruiser and he sits in.\n" +
        "\n" +
        "                          BELL\n" +
        "          Hard to believe.\n" +
        "\n" +
        "                          ROSCOE\n" +
        "          Strolls right back into a crime scene.\n" +
        "           Who would do such a thing? How do\n" +
        "           you defend against it?\n" +
        "          Roscoe closes the door for Sheriff Bell.\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          ROSCOE\n" +
        "          ...Good trip Ed Tom. I'm sorry we\n" +
        "           couldn't help your boy.\n" +
        "          He is walking away.\n" +
        "          Sheriff Bell sits thinking in the cruiser. He makes no move\n" +
        "          for the ignition.\n" +
        "          A long beat.\n" +
        "\n" +
        "          EXT. MOTEL\n" +
        "\n" +
        "          Now very late, empty of onlookers and emergency vehicles.\n" +
        "          Sheriff Bell's cruiser pulls up just inside the courtyard.\n" +
        "          He cuts his engine.\n" +
        "          Sheriff Bell sits looking at the motel.\n" +
        "          Very quiet. After a long beat he gets out of the car. He\n" +
        "          pushes its door shut quietly, with two hands.\n" +
        "          He looks up the veranda.\n" +
        "          The one door, most of the way up, has yellow tape across it.\n" +
        "          Its loose ends wave in a light breeze.\n" +
        "          Sheriff Bell looks up the street.\n" +
        "          Nothing much to attract his attention.\n" +
        "\n" +
        "          EXT. MOTEL VERANDA\n" +
        "\n" +
        "\n" +
        "                         \n" +
        "          Sheriff Bell steps up onto the veranda. He takes slow, quiet\n" +
        "          steps.\n" +
        "\n" +
        "                          104\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "          We intercut his point-of-view, nearing the door marked by\n" +
        "          police tape.\n" +
        "          As he draws close to the door he slows.\n" +
        "          The yellow tape is about chest high. Above it is the lock\n" +
        "          cylinder. It has been punched hollow.\n" +
        "          Sheriff Bell stands staring at the lock.\n" +
        "          Very quiet. The chick, chick, of the tape-ends against the\n" +
        "          door frame.\n" +
        "          Still.\n" +
        "\n" +
        "          INT. MOTEL ROOM\n" +
        "\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         INSIDE\n" +
        "         Chigurh is still also. Just on the other side of the door,\n" +
        "          he stands holding his shotgun.\n" +
        "          From inside, the tap of the breeze-blown tape is dulled but\n" +
        "          perceptible. It counts out beats.\n" +
        "          Chigurh is also looking at the lock cylinder.\n" +
        "          The curved brass of its hollow interior holds a reflection\n" +
        "          of the motel room exterior. Lights and shapes. The curvature\n" +
        "          distorts to unrecognizability what is reflected, but we see\n" +
        "          the color of Sheriff Bell's uniform.\n" +
        "          The reflection is very still. Then, slow movement.\n" +
        "\n" +
        "                         OUTSIDE\n" +
        "         Sheriff Bell finishes bringing his hand to his holstered\n" +
        "          gun. It rests there.\n" +
        "          Still once again.\n" +
        "          His point-of-view of the lock. The reflection from here,\n" +
        "          darker, is hard to read.\n" +
        "\n" +
        "                         INSIDE\n" +
        "         Chigurh, still.\n" +
        "\n" +
        "                         OUTSIDE\n" +
        "\n" +
        "                         \n" +
        "          Sheriff Bell, his hand on his holstered gun. A long beat.\n" +
        "          His hand drops.\n" +
        "\n" +
        "                          105\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "          He extends one booted toe. He nudges the door inward.\n" +
        "          As the lock cylinder slowly recedes, reflected shapes scramble\n" +
        "          inside it and slide up its curve. Before the door is fully\n" +
        "          open we cut around:\n" +
        "\n" +
        "                         FROM INSIDE\n" +
        "         The door finishes creaking open. Sheriff Bell is a silhouette\n" +
        "          in the doorway.\n" +
        "          A still beat.\n" +
        "          At length Sheriff Bell ducks under the chest-high police\n" +
        "          tape to enter.\n" +
        "\n" +
        "                         \n" +
        "          The worn carpet has a large dark stain that glistens near\n" +
        "          the door. Sheriff Bell steps over it, advancing slowly. The\n" +
        "          room is dimly lit shapes.\n" +
        "          There is a bathroom door in the depth of the room. Sheriff\n" +
        "          Bell advances toward it. He stops in front of it.\n" +
        "          He toes the door. It creaks slowly open.\n" +
        "\n" +
        "          INT. MOTEL BATHROOM\n" +
        "\n" +
        "          The bathroom, with no spill light from outside, is pitch\n" +
        "          black.\n" +
        "          Sheriff Bell reaches slowly up with one hand. He gropes at\n" +
        "          the inside wall.\n" +
        "          The light goes on: bright. White tile. Sheriff Bell squints.\n" +
        "          A beat.\n" +
        "          He takes a step in.\n" +
        "          He looks at the small window.\n" +
        "          He looks at the window's swivel-catch, locked.\n" +
        "\n" +
        "          INT. MAIN ROOM\n" +
        "\n" +
        "          Sheriff Bell emerges from the bathroom. He sits heavily onto\n" +
        "          the bed.\n" +
        "          He looks around, not for anything in particular. His look\n" +
        "          catches on something low, just in front of him:\n" +
        "\n" +
        "                         \n" +
        "          A ventilation duct near the baseboard. Its opening is exposed;\n" +
        "          its grille lies on the floor before it.\n" +
        "\n" +
        "                          106\n" +
        "\n" +
        "                         \n" +
        "          Sheriff Bell stares.\n" +
        "          At length he leans forward. He nudges the grille aside. On\n" +
        "          the floor, a couple of screws. A coin.\n" +
        "\n" +
        "          EXT. WEST TEXAS CABIN - DAY\n" +
        "\n" +
        "\n" +
        "                         A CAT\n" +
        "         Licking itself on a plank floor, stiffened leg pointing out.\n" +
        "          It suddenly stops and looks up, ears perked.\n" +
        "          A frozen beat, and then it bolts.\n" +
        "          The camera booms up to frame the barren west Texas landscape\n" +
        "          outside the window of this isolated cabin. A pickup truck is\n" +
        "          approaching, trailing dust. The cat reenters frame outside,\n" +
        "          running across the rutted gravel in front of the house as\n" +
        "          the pickup slows.\n" +
        "\n" +
        "          INT. WEST TEXAS CABIN - KITCHEN - DAY\n" +
        "\n" +
        "          Ellis, an old man in a wheelchair, has one clouded eye.\n" +
        "\n" +
        "                          ELLIS\n" +
        "          Min back!\n" +
        "          Sheriff Bell enters.\n" +
        "\n" +
        "                          BELL\n" +
        "          How'd you know I was here.\n" +
        "\n" +
        "                          ELLIS\n" +
        "          Who else'd be in your truck.\n" +
        "\n" +
        "                          BELL\n" +
        "          You heard it?\n" +
        "\n" +
        "                          ELLIS\n" +
        "          How's that?\n" +
        "\n" +
        "                          BELL\n" +
        "          You heard my -- you havin' fun with\n" +
        "           me?\n" +
        "\n" +
        "                          ELLIS\n" +
        "          What give you that idea. I seen one\n" +
        "           of the cats heard it.\n" +
        "\n" +
        "                          BELL\n" +
        "          But -- how'd you know it was mine?\n" +
        "\n" +
        "                          107\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          ELLIS\n" +
        "          I deduced it. Once you walked in.\n" +
        "          Sheriff Bell stares at him.\n" +
        "\n" +
        "                          BELL\n" +
        "          How many a those things you got now?\n" +
        "\n" +
        "                          ELLIS\n" +
        "          Cats? Several. Wal. Depends what you\n" +
        "           mean by got. Some are half-wild, and\n" +
        "           some are just outlaws.\n" +
        "\n" +
        "                          BELL\n" +
        "          How you been, Ellis?\n" +
        "\n" +
        "                          ELLIS\n" +
        "          You lookin' at it. I got to say you\n" +
        "           look older.\n" +
        "\n" +
        "                          BELL\n" +
        "          I am older.\n" +
        "\n" +
        "                          ELLIS\n" +
        "          Got a letter from your wife. She\n" +
        "           writes pretty regular, tells me the\n" +
        "           family news.\n" +
        "\n" +
        "                          BELL\n" +
        "          Didn't know there was any.\n" +
        "\n" +
        "                          ELLIS\n" +
        "          She just told me you was quittin'.\n" +
        "           Sit down.\n" +
        "          Sheriff Bell lifts an electric percolator off the counter.\n" +
        "\n" +
        "                          BELL\n" +
        "          Want a cup?\n" +
        "\n" +
        "                          ELLIS\n" +
        "          'Predate it.\n" +
        "\n" +
        "                          BELL\n" +
        "          How fresh is this coffee?\n" +
        "\n" +
        "                          ELLIS\n" +
        "          I generally make a fresh pot ever\n" +
        "           week even if there's some left over.\n" +
        "          Sheriff Bell pours some.\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          BELL\n" +
        "          That man that shot you died in prison.\n" +
        "\n" +
        "                          108\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          ELLIS\n" +
        "          In Angola. Yeah.\n" +
        "\n" +
        "                          BELL\n" +
        "          What would you a done if he'd been\n" +
        "           released?\n" +
        "\n" +
        "                          ELLIS\n" +
        "          I don't know. Nothin'. Wouldn't be\n" +
        "           no point to it.\n" +
        "\n" +
        "                          BELL\n" +
        "          I'm kindly surprised to hear you say\n" +
        "           that.\n" +
        "\n" +
        "                          ELLIS\n" +
        "          All the time you spend tryin' to get\n" +
        "           back what's been took from you there's\n" +
        "           more goin' out the door. After a\n" +
        "           while you just try and get a\n" +
        "           tourniquet on it.\n" +
        "          He taps a cigarette ash into a mason jar lid on the table in\n" +
        "          front of him.\n" +
        "\n" +
        "                          ELLIS\n" +
        "          ...Your granddad never asked me to\n" +
        "           sign on as deputy. I done that my\n" +
        "           own self. Loretta says you're\n" +
        "           quittin'.\n" +
        "\n" +
        "                          BELL\n" +
        "          Yes, you've circled round.\n" +
        "\n" +
        "                          ELLIS\n" +
        "          How come're you doin that?\n" +
        "\n" +
        "                          BELL\n" +
        "          I don't know. I feel overmatched.\n" +
        "          A beat.\n" +
        "\n" +
        "                          BELL\n" +
        "          ...I always thought when I got older\n" +
        "           God would sort of come into my life\n" +
        "           in some way. He didn't. I don't blame\n" +
        "           him. If I was him I'd have the same\n" +
        "           opinion about me that he does.\n" +
        "\n" +
        "                          ELLIS\n" +
        "          You don't know what he thinks.\n" +
        "\n" +
        "                          109\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          BELL\n" +
        "          Yes I do.\n" +
        "          A beat.\n" +
        "\n" +
        "                          ELLIS\n" +
        "          I sent Uncle Mac's badge and his old\n" +
        "           thumbbuster to the Rangers. For their\n" +
        "           museum there. Your daddy ever tell\n" +
        "           you how Uncle Mac come to his reward?\n" +
        "          Sheriff Bell shrugs.\n" +
        "\n" +
        "                          ELLIS\n" +
        "          ...Shot down on his own porch there\n" +
        "           in Hudspeth County. There was seven\n" +
        "           or eight of 'em come to the house.\n" +
        "           Wantin' this and wantin' that. Mac\n" +
        "           went back in and got his shotgun but\n" +
        "           they was way ahead of him. Shot him\n" +
        "           down in his own doorway. Aunt Ella\n" +
        "           run out and tried to stop the\n" +
        "           bleedin'. Him tryin to get hold of\n" +
        "           the shotgun again. They just set\n" +
        "           there on their horses watchin' him\n" +
        "           die. Finally one of 'em says somethin'\n" +
        "           in Injun and they all turned and\n" +
        "           left out. Well Mac knew the score\n" +
        "           even if Aunt Ella didn't. Shot through\n" +
        "           the left lung and that was that. As\n" +
        "           they say.\n" +
        "\n" +
        "                          BELL\n" +
        "          When did he die?\n" +
        "\n" +
        "                          ELLIS\n" +
        "          Nineteen zero and nine.\n" +
        "\n" +
        "                          BELL\n" +
        "          No, I mean was it right away or in\n" +
        "           the night or when was it.\n" +
        "\n" +
        "                          ELLIS\n" +
        "          Believe it was that night. She buried\n" +
        "           him the next mornin'. Diggin' in\n" +
        "           that hard caliche.\n" +
        "          A beat.\n" +
        "\n" +
        "                          110\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          ELLIS\n" +
        "          ...What you got ain't nothin' new.\n" +
        "           This country is hard on people. Hard\n" +
        "           and crazy. Got the devil in it yet\n" +
        "           folks never seem to hold it to\n" +
        "           account.\n" +
        "\n" +
        "                          BELL\n" +
        "          Most don't.\n" +
        "\n" +
        "                          ELLIS\n" +
        "          You're discouraged.\n" +
        "\n" +
        "                          BELL\n" +
        "          I'm... discouraged.\n" +
        "\n" +
        "                          ELLIS\n" +
        "          You can't stop what's comin. Ain't\n" +
        "           all waitin' on you.\n" +
        "          The two men look at each other. Ellis shakes his head.\n" +
        "\n" +
        "                          ELLIS\n" +
        "          ...That's vanity.\n" +
        "          After a beat, a fast fade.\n" +
        "\n" +
        "          EXT. GRAVESITE - ODESSA - DAY\n" +
        "\n" +
        "          In black we hear the chink-chink-chink of chain being played\n" +
        "          out and the hum of a motor.\n" +
        "          We cut to a dark foreground shape being lowered in sync with\n" +
        "          the clinking sound. As it drops it clears a tombstone\n" +
        "\n" +
        "                         PROGRESSIVELY REVEALED:\n" +
        "         The name, Agnes Kracik.\n" +
        "          Her dates: 1922-1980.\n" +
        "          The inscription: Beloved Mother.\n" +
        "          Off that we cut to Carla Jean, standing by in a black dress\n" +
        "          and dark veil.\n" +
        "\n" +
        "          EXT. A SMALL SUBURBAN HOUSE - DAY\n" +
        "\n" +
        "          A parched square of grass in front of the house. A rusty\n" +
        "          station wagon pulls into the driveway and stops. Carla Jean\n" +
        "          gets out.\n" +
        "\n" +
        "                          111\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "          INT. KITCHEN\n" +
        "\n" +
        "          Carla Jean enters and puts on the kettle. She opens the\n" +
        "          cupboard looking for something.\n" +
        "\n" +
        "          KITCHEN - LATER\n" +
        "         Carla Jean sits at the kitchen table drinking tea. She looks\n" +
        "          out the window.\n" +
        "          Across the street kids are running through a sprinkler that\n" +
        "          chugs in the yard.\n" +
        "\n" +
        "          INT. BEDROOM\n" +
        "\n" +
        "\n" +
        "                         BEDROOM DOOR\n" +
        "\n" +
        "                         \n" +
        "          The door opens and Carla Jean enters holding her hat and\n" +
        "          veil. She throws the light switch and stops, hand frozen,\n" +
        "          looking into the room.\n" +
        "          After a beat:\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          I knew this wasn't done with.\n" +
        "          Chigurh sits at the far end of the room in the late-afternoon\n" +
        "          shadows.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          No.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          I ain't got the money.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          No.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          What little I had is long gone and\n" +
        "           they's bill aplenty to pay yet. I\n" +
        "           buried my mother today. I ain't paid\n" +
        "           for that neither.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          I wouldn't worry about it.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          ...I need to sit down.\n" +
        "          Chigurh nods at the bed and Carla Jean sits down, hugging\n" +
        "          her hat and veil.\n" +
        "\n" +
        "                          112\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          ...You got no cause to hurt me.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          No. But I gave my word.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          You gave your word?\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          To your husband.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          That don't make sense. You gave your\n" +
        "           word to my husband to kill me?\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Your husband had the opportunity to\n" +
        "           remove you from harm's way. Instead,\n" +
        "           he used you to try to save himself.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          Not like that. Not like you say.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          I don't say anything. Except it was\n" +
        "           foreseen.\n" +
        "          A beat.\n" +
        "\n" +
        "                          CARLA JEAN\n" +
        "          I knowed you was crazy when I saw\n" +
        "           you settin' there. I knowed exactly\n" +
        "           what was in store for me.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Yes. Things fall into place.\n" +
        "\n" +
        "          EXT. HOUSE\n" +
        "\n" +
        "          Minutes later.\n" +
        "          A beat.\n" +
        "          The front door swings open and Chigurh emerges.\n" +
        "          He pauses with one hand on the jamb and looks at the sole of\n" +
        "          each boot in turn.\n" +
        "          He goes to the pickup in the driveway.\n" +
        "\n" +
        "                          113\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "          INT. PICKUP/EXT. INTERSECTION - A MINUTE LATER\n" +
        "\n" +
        "          He is driving.\n" +
        "          His point-of-view: coming upon an empty intersection, his\n" +
        "          light green.\n" +
        "          Back to Chigurh.\n" +
        "          He just starts to turn his head to the right.\n" +
        "          A huge crash.\n" +
        "\n" +
        "          EXT. INTERSECTION\n" +
        "\n" +
        "          Chigurh's pickup has been T-boned by an old crate of a\n" +
        "          pickup. Both vehicles slide to a halt amid broken glass in\n" +
        "          the middle of the intersection.\n" +
        "          The windshield of the truck that ran the light is mostly\n" +
        "          gone. The driver is draped dead on the wheel.\n" +
        "          After a beat the door of Chigurh's truck is pushed open. He\n" +
        "          staggers out, heavily favoring one leg where the jeans are\n" +
        "          shredded and bloody at the thigh. One arm is also bloody and\n" +
        "          hangs limp. Blood runs down his face from a scalp wound.\n" +
        "          He staggers to a lawn and sits.\n" +
        "          He looks up.\n" +
        "          Two teenage boys have come out of somewhere. They goggle at\n" +
        "          him.\n" +
        "\n" +
        "                          BOY 1\n" +
        "          Mister there's a bone stickin' out\n" +
        "           of your arm.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          I'm all right. Let me just sit here\n" +
        "           a minute.\n" +
        "\n" +
        "                          BOY 2\n" +
        "          There's an ambulance comin. Man over\n" +
        "           yonder went to call.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          All right.\n" +
        "\n" +
        "                          BOY 1\n" +
        "          Are you all right? You got a bone\n" +
        "           stickin' out of your arm.\n" +
        "\n" +
        "                          114\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          CHIGURH\n" +
        "          What will you take for that shirt?\n" +
        "          The two boys look at each other. They look back.\n" +
        "\n" +
        "                          BOY 2\n" +
        "          What shirt?\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Any damn shirt. I need something to\n" +
        "           wrap around my head and I need a\n" +
        "           sling for this arm.\n" +
        "          Boy 2 unbuttons his shirt.\n" +
        "\n" +
        "                          BOY 2\n" +
        "          Hell mister, I'll give you my shirt.\n" +
        "\n" +
        "                         \n" +
        "          Chigurh uses his teeth to clamp the shirt and rips it and\n" +
        "          wraps a swatch around his head. He twists the rest of the\n" +
        "          shirt into a sling and puts the limp arm in.\n" +
        "\n" +
        "                          BOY 1\n" +
        "          Look at that fuckin' bone.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Tie this for me.\n" +
        "          The two boys look at each other.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          ...Just tie it.\n" +
        "          Boy 2, the one now wearing a T-shirt, ties it.\n" +
        "          Chigurh pulls a bill clip from his pocket and draws a bill\n" +
        "          out with his teeth. He holds it out to the boy.\n" +
        "\n" +
        "                          BOY 2\n" +
        "          Hell mister, I don't mind helpin'\n" +
        "           somebody out. That's a lot of money.\n" +
        "\n" +
        "                          CHIGURH\n" +
        "          Take it. Take it and you didn't see\n" +
        "           me. I was already gone.\n" +
        "\n" +
        "                          BOY 2\n" +
        "          Yessir.\n" +
        "          Wide on Chigurh limping off.\n" +
        "\n" +
        "                         \n" +
        "          We can just hear the boys, small:\n" +
        "\n" +
        "                          115\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          BOY 1\n" +
        "          Part of that's mine.\n" +
        "\n" +
        "                          BOY 2\n" +
        "          You still got your damn shirt.\n" +
        "\n" +
        "                          BOY 1\n" +
        "          That ain't what it was for.\n" +
        "\n" +
        "                          BOY 2\n" +
        "          Maybe, but I'm still out a shirt.\n" +
        "\n" +
        "          INT. BELL'S KITCHEN - DAY\n" +
        "\n" +
        "          Loretta pours Sheriff Bell and then herself morning coffee.\n" +
        "\n" +
        "                          BELL\n" +
        "          Maybe I'll go ridin.\n" +
        "\n" +
        "                          LORETTA\n" +
        "          Okay.\n" +
        "\n" +
        "                          BELL\n" +
        "          What do you think.\n" +
        "\n" +
        "                          LORETTA\n" +
        "          I can't plan your day.\n" +
        "\n" +
        "                          BELL\n" +
        "          I mean, would you care to join me.\n" +
        "\n" +
        "                          LORETTA\n" +
        "          Lord no. I'm not retired.\n" +
        "          A beat.\n" +
        "          Sheriff Bell sips his coffee.\n" +
        "\n" +
        "                          BELL\n" +
        "          Maybe I'll help here then.\n" +
        "          A beat.\n" +
        "          Loretta takes a sip.\n" +
        "\n" +
        "                          LORETTA\n" +
        "          Better not.\n" +
        "          They both sip.\n" +
        "\n" +
        "                          LORETTA\n" +
        "          ...How'd you sleep?\n" +
        "\n" +
        "                          116\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          BELL\n" +
        "          I don't know. Had dreams.\n" +
        "\n" +
        "                          LORETTA\n" +
        "          Well you got time for 'em now.\n" +
        "           Anything interesting?\n" +
        "\n" +
        "                          BELL\n" +
        "          Well they always is to the party\n" +
        "           concerned.\n" +
        "\n" +
        "                          LORETTA\n" +
        "          Ed Tom, I'll be polite.\n" +
        "\n" +
        "                          BELL\n" +
        "          Okay. Two of 'em. Both had my father.\n" +
        "           It's peculiar. I'm older now'n he\n" +
        "           ever was by twenty years. So in a\n" +
        "           sense he's the younger man. Anyway,\n" +
        "           first one I don't remember so well\n" +
        "           but it was about meetin' him in town\n" +
        "           somewheres and he give me some money\n" +
        "           and I think I lost it. The second\n" +
        "           one, it was like we was both back in\n" +
        "           older times and I was on horseback\n" +
        "           goin' through the mountains of a\n" +
        "           night.\n" +
        "\n" +
        "          EXT. SNOWY MOUNTAIN PASS - NIGHT\n" +
        "\n" +
        "          We cut to night, and snow. It is the image that the movie\n" +
        "          began with. Continuing in voice over:\n" +
        "\n" +
        "                          VOICE OVER\n" +
        "          ...goin' through this pass in the\n" +
        "           mountains. It was cold and snowin',\n" +
        "           hard ridin'. Hard country. He rode\n" +
        "           past me and kept on goin'. Never\n" +
        "           said nothin' goin' by. He just rode\n" +
        "           on past and he had his blanket wrapped\n" +
        "           around him and his head down...\n" +
        "          The rider passes as described, horses' hooves drumming and\n" +
        "          scattering divots of earth and snow.\n" +
        "\n" +
        "                          117\n" +
        "\n" +
        "                         \n" +
        "\n" +
        "                          VOICE OVER\n" +
        "          ...and when he rode past I seen he\n" +
        "           was carryin' fire in a horn the way\n" +
        "           people used to do and I could see\n" +
        "           the horn from the light inside of\n" +
        "           it. About the color of the moon. And\n" +
        "           in the dream I knew that he was goin'\n" +
        "           on ahead and that he was fixin' to\n" +
        "           make a fire somewhere out there in\n" +
        "           all that dark and all that cold, and\n" +
        "           I knew that whenever I got there he\n" +
        "           would be there. Out there up ahead.\n" +
        "          The rider recedes and the image fades, the horn bearing fire\n" +
        "          going last.\n" +
        "\n" +
        "                          THE END\n";
    // var options = {
    //     debug: 'info',
    //     modules: {
    //        toolbar: [
    //     [{ header: [1, 2, false] }],
    //     ['bold', 'italic', 'underline'],
    //     ['image', 'code-block']
    // ]
    //     },
    //     placeholder: $scope.trix,
    //     readOnly: true,
    //     theme: 'snow'
    // };
    // var container = document.getElementById('editor-container');
    var BackgroundClass = Quill.import('attributors/class/background');
    var ColorClass = Quill.import('attributors/class/color');
    var SizeStyle = Quill.import('attributors/style/size');
    Quill.register(BackgroundClass, true);
    Quill.register(ColorClass, true);
    Quill.register(SizeStyle, true);

    $scope.quill = new Quill('#editor-container', {
        placeholder: $scope.trix,

        modules: {
            "toolbar": false
        },
        theme: 'bubble'
    });
    $scope.quill.setText( $scope.trix);
    $scope.quill.on('selection-change', function(range, oldRange, source) {
        if (range) {
            if (range.length == 0) {
                console.log('User cursor is on', range.index);
            } else {
                // $scope.quill.setSelection(range.index, range.length);
                $scope.quill.formatText(range.index, range.length,'background-color',$scope.selectedClass.color)
                console.log('User has highlighted with ', $scope.quill.getFormat());
                var text =  $scope.quill.getText(range.index, range.length);
                console.log('User has highlighted', text);
            }
        } else {
            console.log('Cursor not in the editor');
        }
    });

    $scope.quill.on('text-change', function(delta, oldDelta, source) {
        if (source == 'api') {
            console.log("An API call triggered this change.");
        } else if (source == 'user') {
            console.log("A user action triggered this change.");
        }
    });
    // var editor = new Quill(container,options);

        //TEXT Selection
        $scope.selectedText = '';
        $scope.textSelected = function(text){
            $scope.selectedText = text;
            $scope.$apply();
            //alert(text);
        };
        $scope.text=$sce.trustAsHtml("<i>result has been saved successfully.</i>");


        //VIDEO GULAR


    Trix.config.textAttributes.foregroundColor = {
        styleProperty: "color",
        inheritable: 1
    };

    Trix.config.textAttributes.heading = { inheritable: true, tagName: 'h1' };
    Trix.config.textAttributes.subHeading = { inheritable: true, tagName: 'h2' };
        $scope.trixInitialize = function(e, editor) {
                editor.getSelectedRange()  // [0, 0]
                console.log(editor.getSelectedRange())
            }

        var events = ['trixInitialize', 'trixChange', 'trixSelectionChange', 'trixFocus', 'trixBlur', 'trixFileAccept', 'trixAttachmentAdd', 'trixAttachmentRemove'];
        Trix.config.textAttributes.foregroundColor = {
            styleProperty: "color",
            inheritable: 1
        }
        $scope.color;
        for (var i = 0; i < events.length; i++) {
            $scope[events[i]] = function(e,editor) {
                // var toolbar, toolbar_id;
                // toolbar_id = event.target.getAttribute('toolbar');
                // toolbar = document.getElementById(toolbar_id);
                // toolbar.style.display = 'none';
                // console.info('Event type:', e.type);
                if( e.type==="trix-selection-change"){
                    editor.activateAttribute( "background-color",$scope.selectedClass)
                    editor.activateAttribute( "foregroundColor","red")
                    editor.activateAttribute("italic")

                    console.info('Event type:', e.type);
                }
                if( e.type==="trix-focus"){
                    var toolbar, toolbar_id;
                    toolbar_id = event.target.getAttribute('toolbar');
                    toolbar = document.getElementById(toolbar_id);
                    toolbar.style.display = 'block';
                    event.target.toolbarElement.style.display = "block";
                }
                if( e.type==="trix-blur"){
                    var toolbar, toolbar_id;
                    toolbar_id = event.target.getAttribute('toolbar');
                    toolbar = document.getElementById(toolbar_id);
                    toolbar.style.display = 'none';
                    event.target.toolbarElement.style.display = "none";
                }
                if( e.type==='trix-change'){
                    console.log(editor.getSelectedDocument().toString())


                }

            }
        };









        $scope.videoService=videoService;
        $scope.annotationService=annotationService;

        $scope.algoService=algoService;
        $scope.classes=[];
        $scope.tempClassCollection={};
        $scope.tempClassCollection.classes=[{number:0,name:'Fill in',color:"#3865a8"},{number:1,name:'Fill in',color:"#3865a8"}];
        $scope.tempClassCollection.name="Fill in Name";
        $scope.addTempClass=function(){
            $scope.tempClassCollection.classes.push({number: $scope.tempClassCollection.classes.length+1,name:'Fill in',color:"#3865a8"});
        };
        $scope.addClass=function(){
            $scope.getSelectedClasses().classes.push({number: $scope.tempClassCollection.classes.length+1,name:'Fill in',color:"#3865a8"});
        };

        $scope.selectedClasses={};
        $scope.selectedClass={};


        var data = {
            access_token:AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length)

        };
        var config = {
            params: data,
            headers : {'Content-Type': 'application/json'}

        };
       $scope.loadClassesInit= function(){  $http.get(
            API_ENDPOINT.url+'/classes/get',config

        ).then(angular.bind(this,function(response) {
                console.log('in controller'+response.data);
                /* var json = JSON.parse(response.data.json);
                 net = new convnetjs.Net();*/
                if(response.data!=null){
                    $scope.classes=response.data.map(function(annotaion_class){
                        annotaion_class.classes=annotaion_class.classes.map(function (cl) {
                            if(!('color' in cl)){
                                cl.color="#3865a8"
                            }
                            return cl
                        })
                       return annotaion_class
                    })
                    // $scope.classes=   response.data;
                    $scope.selectedClasses= $scope.classes[0];
                    $scope.selectedClass=$scope.selectedClasses.classes[0];
                    annotationService.selectedClass=   $scope.selectedClass;

                }

                //return response.data;
            }));
        };
        $scope.loadClassesInit();
       $scope.setSelectedClasses=function(index){

           $scope.selectedClasses=$scope.classes[index];

        };
        $scope.getSelectedClasses=function(){

            return   $scope.selectedClasses;
        };

        $scope.addClasses=function(){

            $scope.selectedClasses.classes.push({number:  $scope.selectedClasses.classes.length,name:'Fill in'});


        };

        $scope.deleteClass=function(index){

            $scope.classes.splice(index,1);
            $scope.classes.join();

        },
        $scope.setSelectedClass=function(index){

            $scope.selectedClass=$scope.selectedClasses.classes[index];
            annotationService.setSelectedClass( $scope.selectedClass)
        };
        $scope.getClasses=function(){

            return $scope.classes;
        };
        $scope.getSelectedClass=function(){

           return $scope.selectedClass;
        },

       $scope.saveClasses=function(classCollection){
            var data ={
                classes:classCollection,
                _id:classCollection._id

            };
            $http({
                url:API_ENDPOINT.url+ '/classes/save',
                method: "POST",
                data: data,
                headers: {'Content-Type': 'application/json'}}).then(function(response)
            {
                console.log('success')
           /*    $scope.setSelectedClasses(  $scope.classes.length-1);
               $scope.classes.push(classCollection);*/
                $scope.loadClassesInit();
                $scope.tempClassCollection={};
                $scope.tempClassCollection.classes=[{number:0,name:'Fill in'},{number:1,name:'Fill in'}];
                $scope.tempClassCollection.name="Fill in Name";
            })   // success
                .catch(function() {console.log('error')});

        };

        /*    $scope.$on('$destroy', function( event ) {
            $localStorage.left = 'toda';
            window.localStorage.setItem("left", new Date());
            if (! $localStorage.left) {
                event.preventDefault();
            }
        });*/
        function buildRectangle() {
            return {startX: 10,
                startY: 10,
                sizeX: 100,
                sizeY: 100,
                name: 'rect'
            };
        };
        algoService.loadMyAlgoritms();
        $scope.image = {
            src: 'assets/admin/pages/media/gallery/image4.jpg',
            maxWidth: 938
        };
        // Must be [x, y, x2, y2, w, h]
        $scope.image.coords = [100, 100, 200, 200, 100, 100];

        // You can add a thumbnail if you want
        $scope.image.thumbnail = true;
        $scope.selector = {};
        $scope.selection={};

        $scope.drawer = [
            { x1: 625, y1: 154, x2: 777, y2: 906, color: '#337ab7', stroke: 1 },
            { x1: 778, y1: 154, x2: 924, y2: 906, color: '#3c763d', stroke: 1 },
            { x1: 172, y1: 566, x2: 624, y2: 801, color: '#a94442', stroke: 1 }
        ];

        $scope.addRect = function () {
            $scope.drawer.push({
                x1: $scope.selector.x1,
                y1: $scope.selector.y1,
                x2: $scope.selector.x2,
                y2: $scope.selector.y2,
                color: '#337ab7',
                stroke: 1
            });
            $scope.selector.clear();
        };

        $scope.cropRect = function () {
            $scope.cropResult = $scope.selector.crop();
        };

        // List of rectangles
        $scope.rectangles = [];

        // Create shapes
        for (var i = 0; i < 2; i++) {
            $scope.rectangles.push( buildRectangle() );
        }

        $scope.$on('$viewContentLoaded', function() {



        // initialize core components
        // emit event track (without properties)
        var someSessionObj = { 'innerObj' : 'somesessioncookievalue'};
      //  $scope.inviewService=inviewService;
        $cookies.dotobject = someSessionObj;
        $scope.usingCookies = { 'cookies.dotobject' : $cookies.dotobject, "cookieStore.get" : $cookieStore.get('dotobject') };

        $cookieStore.put('obj', someSessionObj);
        $scope.usingCookieStore = { "cookieStore.get" : $cookieStore.get('obj'), 'cookies.dotobject' : $cookies.obj, };

            $scope.slider = {
                minValue: 100,
                maxValue: 400,
                options: {
                    floor: 0,
                    ceil: 500,
                    translate: function(value) {
                        return '$' + value;
                    }
                }
            };

            var actions =[1,2,3];
           // var brain=new deepqlearn.Brain(1, 3)
            var action;
         //   $analytics.eventTrack( );

            // emit event track (with category and label properties for GA)
          /*  $analytics.eventTrack('eventName', {
                category: 'category', label: 'label'
            });*/
            Metronic.initAjax();

         /*   $scope.events = [];*/
          /*  $scope.idle = 5;
            $scope.timeout = 5;*/

           /* $scope.$on('IdleStart', function() {
                addEvent({event: 'IdleStart', date: new Date()});
                $analytics.eventTrack('IdleStart', {event: 'IdleStart', date: new Date()});
               action= deepQLearnService.forward(1);
                console.log(action);
                if(action=1){

                    deepQLearnService.backward(1);
                    $scope.reset();
                }else{
                    deepQLearnService.backward(0);
                }
            });
            $scope.$on('IdleEnd', function() {
                addEvent({event: 'IdleEnd', date: new Date()});
                $analytics.eventTrack('IdleEnd', {event: 'IdleEnd', date: new Date()});
                action= deepQLearnService.forward(2);
                console.log(action);
                if(action=1){
                    deepQLearnService.backward(1);
                    $scope.reset();
                }else{
                    deepQLearnService.backward(0);
                }

            });
            $scope.$on('IdleWarn', function(e, countdown) {
                addEvent({event: 'IdleWarn', date: new Date(), countdown: countdown});
                $analytics.eventTrack('IdleWarn', {event: 'IdleWarn', date: new Date()});
                action= deepQLearnService.forward(3);
                console.log(action);
                if(action=1){
                    deepQLearnService.backward(1);
                    $scope.reset();
                }else{
                    deepQLearnService.backward(0);
                }
            });
            $scope.$on('IdleTimeout', function() {
                addEvent({event: 'IdleTimeout', date: new Date()});
                $analytics.eventTrack('IdleTimeout', {event: 'IdleTimeout', date: new Date()});
                action= deepQLearnService.forward(4);
                console.log(action);
                if(action=1){
                    deepQLearnService.backward(1);
                    $scope.reset();
                }else{
                    deepQLearnService.backward(0);
                }
            });
            $scope.$on('Keepalive', function() {
                addEvent({event: 'Keepalive', date: new Date()});
                $analytics.eventTrack('Keepalive', {event: 'Keepalive', date: new Date()});
                action= deepQLearnService.forward(5);
                console.log(action);
              // deepQLearnService.savenet();
                if(action=1){
                    deepQLearnService.backward(1);
                    $scope.reset();
                }else{
                    deepQLearnService.backward(0);
                }
            });*/
          /*  function addEvent(evt) {
                $scope.$evalAsync(function() {
                    $scope.events.push(evt);
                })
            }*/

           /* $scope.reset = function() {
                Idle.watch();
            }
            $scope.$watch('idle', function(value) {
                if (value !== null) Idle.setIdle(value);
            });
            $scope.$watch('timeout', function(value) {
                if (value !== null) Idle.setTimeout(value);
            });*/


    });
});
