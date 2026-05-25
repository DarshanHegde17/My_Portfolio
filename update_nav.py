import re

# Read the file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the navbar
old_nav = '            <li><a href="#experience">Experience</a></li>\n            </ul>'
new_nav = '            <li><a href="#experience">Experience</a></li>\n            <li><a href="#services">Services</a></li>\n            <li><a href="#testimonials">Testimonials</a></li>\n            </ul>'

content = content.replace(old_nav, new_nav)

# Update footer links
old_footer = '''          <a href="#experience"><i class="fas fa-chevron-circle-right"></i> Experience</a>
      </div>'''
new_footer = '''          <a href="#experience"><i class="fas fa-chevron-circle-right"></i> Experience</a>
          <a href="#services"><i class="fas fa-chevron-circle-right"></i> Services</a>
          <a href="#testimonials"><i class="fas fa-chevron-circle-right"></i> Testimonials</a>
      </div>'''

content = content.replace(old_footer, new_footer)

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Navigation updated successfully!")
