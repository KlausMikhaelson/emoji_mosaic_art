import json
import unicodedata

# Load the emoji data
with open('./emoji.json', 'r') as f:
    emoji_data = json.load(f)

# Create the new dataset
new_emoji_data = []

# Function to determine the color of the emoji

for emoji in emoji_data:
    char = chr(int(emoji['unified'].split('-')[0], 16))
    
    # You would need to determine the color values for each emoji
    # function to determine the color of the emoji
    color = determine_color(emoji['image'])
    
    new_emoji_data.append({
        "char": char,
        "color": color
    })

# Save the new dataset
with open('new_emoji_data.json', 'w') as f:
    json.dump(new_emoji_data, f, ensure_ascii=False)