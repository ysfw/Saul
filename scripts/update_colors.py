import re

files_tsx = ["index.tsx", "advisor.tsx"]
for f in files_tsx:
    with open(f, "r") as file:
        content = file.read()

    if "themeColor" not in content:
        content = content.replace(
            'import { styles }', 'import { themeColor } from "./theme";\nimport { styles }'
        )

    content = content.replace('color="#FFD700"', 'color={themeColor}')
    content = content.replace('color="#E5C07B"', 'color={themeColor}')

files_styles = ["index.styles.ts", "advisor.styles.ts"]
for f in files_styles:
    with open(f, "r") as file:
        content = file.read()

    if "import { Colors }" not in content:
        content = content.replace(
            'import { StyleSheet } from "react-native";',
            'import { StyleSheet } from "react-native";\nimport { Colors } from "./theme";'
        )

    replacements = {
        '"#000000"': "Colors.background",
        '"#121212"': "Colors.surface",
        '"#1A1A1A"': "Colors.surfaceLight",
        '"#FFFFFF"': "Colors.textPrimary",
        '"#A0A0A0"': "Colors.textSecondary",
        '"#E0E0E0"': "Colors.textMuted",
        '"#333333"': "Colors.border",
        '"#2A2A2A"': "Colors.borderLight",
        '"#FFD700"': "Colors.primary",
        '"#E5C07B"': "Colors.primary",
        '"rgba(255, 215, 0, 0.15)"': "Colors.primaryAlpha15",
        '"rgba(229, 192, 123, 0.15)"': "Colors.primaryAlpha15",
        '"rgba(255, 215, 0, 0.3)"': "Colors.primaryAlpha30",
        '"rgba(229, 192, 123, 0.3)"': "Colors.primaryAlpha30",
        '"rgba(255, 215, 0, 0.1)"': "Colors.primaryAlpha10",
        '"rgba(229, 192, 123, 0.1)"': "Colors.primaryAlpha10",
    }

    for old, new in replacements.items():
        content = content.replace(old, new)

    with open(f, "w") as file:
        file.write(content)

print("Colors updated successfully.")