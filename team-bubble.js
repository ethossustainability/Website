// Team Bubble System for Ethos Website
const teamMembers = [
    {
        name: 'Prahaladh Gopalakrishnan',
        role: 'Executive Director',
        image: 'Assets/TeamPics/Prahaladh.jpg',
        objectPosition: '50% 50%',
        bio: 'Student researcher and technology-focused entrepreneur studying at the Texas Academy of Mathematics and Science (TAMS). His work centers on energy systems, sustainable materials, and applied chemical engineering. He leads multiple hands-on innovation efforts, including hydrogel product development and solar engineering projects, managing small research and engineering teams to move ideas from early experimentation to functional models. Deeply committed to sustainability, clean energy, and technical leadership.'
    },
    {
        name: 'Shriya Deoli',
        role: 'VP of the Board',
        image: 'Assets/TeamPics/Shriya.jpg',
        objectPosition: '50% 50%',
        bio: 'Shriya Deoli is the VP of the board, business advisor, and administrative assistant at Ethos sustainability, where she helps develop workshops and other projects to educate students in sustainability and business.'
    },
    {
        name: 'Mico Hastings',
        role: 'Financial Director & Treasurer',
        image: 'Assets/TeamPics/Mico.jpg',
        objectPosition: '50% 50%',
        bio: 'His work with Ethos Sustainability primarly centers around the management of finances and data within the organization, collaborating with the Board to determine budgeting plans and to facilitate assets.'
    },
    {
        name: 'Juhi Lohiya',
        role: 'Operations Director',
        image: 'Assets/TeamPics/Juhi.jpg',
        objectPosition: '50% 25%',
        bio: 'Juhi manages internal operations at Ethos Sustainability and is someone who passionately wants to make a positive impact on the environment as well as people!'
    },
    {
        name: 'Gautham Nair',
        role: 'Systems Lead',
        image: 'Assets/TeamPics/Nair.png',
        objectPosition: '50% 50%',
        bio: 'Systems lead for the website, app, and AV. If anything technical fails, you know who to blame!'
    },
    {
        name: 'Gregory Daley',
        role: 'Head of Projects Department',
        image: 'Assets/TeamPics/Gregory.png',
        objectPosition: '50% 50%',
        bio: 'I oversee the various STEM projects at Ethos such as the solar car team.'
    },
    {
        name: 'Arabella Glass',
        role: 'STEM Department Head & Design Team',
        image: 'Assets/TeamPics/Arabella.jpg',
        objectPosition: '50% 50%',
        bio: 'Arabella Glass is a high school senior at Waterford Kettering High school in Waterford, Michigan. She loves spending time outside, and participates on multiple different sports teams and clubs. Her goal is to one day open up her own wildlife sanctuary. She is the STEM department head and is on the design team for Ethos.'
    },
    {
        name: 'Ruhan Nagwekar',
        role: 'Newsletter Lead',
        image: 'Assets/TeamPics/Nagwekar.jpg',
        objectPosition: '50% 50%',
        bio: 'Ruhan Nagwekar is the Newsletter Lead at Ethos Sustainability.'
    }
    ,
    {
        name: 'Sai Are',
        role: 'Team Member',
        image: 'Assets/TeamPics/Are.jpg',
        objectPosition: '50% 50%',
        bio: ''
    },
    {
        name: 'Prahas Kumar',
        role: 'Team Member',
        image: 'Assets/TeamPics/Kumar.jpeg',
        objectPosition: '50% 50%',
        bio: ''
    }
];

function getRandomShape() {
    const r = () => Math.floor(Math.random() * 30 + 35);
    return `${r()}% ${100 - r()}% ${r()}% ${100 - r()}% / ${r()}% ${100 - r()}% ${r()}% ${100 - r()}%`;
}

function showDetail(name, role, bio, group, image, objectPosition, zoom) {
    // Modal logic (reuse existing modal or create a new one)
    const modal = document.getElementById('teamModal');
    document.getElementById('modalPhoto').src = image;
    document.getElementById('modalPhoto').style.objectPosition = objectPosition || '50% 50%';
    document.getElementById('modalPhoto').style.transform = `scale(${zoom || 1})`;
    document.getElementById('modalName').textContent = name;
    document.getElementById('modalRole').textContent = role;
    document.getElementById('modalBio').textContent = bio;
    modal.classList.add('active');
}

document.addEventListener('DOMContentLoaded', function () {
    const boardGrid = document.getElementById('boardGrid');
    const coordinatorsGrid = document.getElementById('coordinatorsGrid');
    for (let i = 0; i < teamMembers.length; i++) {
        const member = document.createElement('div');
        member.className = 'bubble-item';
        member.style.borderRadius = getRandomShape();
        member.style.animationName = `morph-${Math.floor(Math.random() * 4) + 1}`;
        member.style.animationDuration = `${Math.random() * 4 + 6}s`;
        member.style.animationDelay = `${Math.random() * -10}s`;
        const { name, role, bio, image, objectPosition, zoom } = teamMembers[i];
        const finalObjectPosition = objectPosition || '50% 50%';
        const finalZoom = zoom || 1;
        member.onclick = () => showDetail(name, role, bio, 'team', image, finalObjectPosition, finalZoom);
        let imgContent = '';
        if (image) {
            imgContent = `<img src="${image}" alt="${name}" class="bubble-img" style="object-position: ${finalObjectPosition}; --zoom: ${finalZoom}">`;
        }
        member.innerHTML = `
            <div class="bubble-img-placeholder">
               ${imgContent}
               <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="${image ? 'display:none' : ''}"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <div class="bubble-content">
                <h4>${name}</h4>
                <span class="role-highlight">${role}</span>
            </div>
        `;
        if (i < 5) {
            boardGrid.appendChild(member);
        } else {
            coordinatorsGrid.appendChild(member);
        }
    }
    // Modal close logic
    document.querySelector('.modal-close').onclick = () => {
        document.getElementById('teamModal').classList.remove('active');
    };
    document.querySelector('.modal-overlay').onclick = () => {
        document.getElementById('teamModal').classList.remove('active');
    };
});
