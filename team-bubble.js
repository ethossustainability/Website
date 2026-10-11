// Team Bubble System for Ethos Website
let activePersonButton = null;
const boardMembers = [
    {
        name: 'Prahaladh Gopalakrishnan',
        role: 'Executive Director',
        image: 'Assets/TeamPics/Prahaladh.webp',
        objectPosition: '50% 50%',
        bio: 'Student researcher and technology-focused entrepreneur studying at the Texas Academy of Mathematics and Science (TAMS). His work centers on energy systems, sustainable materials, and applied chemical engineering. He leads multiple hands-on innovation efforts, including hydrogel product development and solar engineering projects, managing small research and engineering teams to move ideas from early experimentation to functional models. Deeply committed to sustainability, clean energy, and technical leadership.'
    },
    {
        name: 'Shriya Deoli',
        role: 'VP of the Board',
        image: 'Assets/TeamPics/Shriya.webp',
        objectPosition: '50% 50%',
        bio: 'Shriya Deoli is the VP of the board, business advisor, and administrative assistant at Ethos sustainability, where she helps develop workshops and other projects to educate students in sustainability and business.'
    },
    {
        name: 'Mico Hastings',
        role: 'Financial Director & Treasurer',
        image: 'Assets/TeamPics/Mico.webp',
        objectPosition: '50% 50%',
        bio: 'His work with Ethos Sustainability primarly centers around the management of finances and data within the organization, collaborating with the Board to determine budgeting plans and to facilitate assets.'
    },
    {
        name: 'Juhi Lohiya',
        role: 'Operations Director',
        image: 'Assets/TeamPics/Juhi.webp',
        objectPosition: '50% 25%',
        bio: 'Juhi manages internal operations at Ethos Sustainability and is someone who passionately wants to make a positive impact on the environment as well as people!'
    },
    {
        name: 'Gautham Nair',
        role: 'Systems Lead',
        image: 'Assets/TeamPics/Nair.webp',
        objectPosition: '50% 50%',
        bio: 'Systems lead for the website, app, and AV. If anything technical fails, you know who to blame!'
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
    document.body.style.overflow = 'hidden';
    document.querySelector('.modal-close').focus();
}

document.addEventListener('DOMContentLoaded', function () {
    const boardGrid = document.getElementById('boardGrid');
    for (let i = 0; i < boardMembers.length; i++) {
        const member = document.createElement('button');
        member.type = 'button';
        member.className = 'people-card';
        const { name, role, bio, image, objectPosition, zoom } = boardMembers[i];
        const finalObjectPosition = objectPosition || '50% 50%';
        const finalZoom = zoom || 1;
        member.setAttribute('aria-label', `Meet ${name}, ${role}`);
        member.onclick = () => {
            activePersonButton = member;
            showDetail(name, role, bio || 'Part of the board bringing sustainable education to life.', 'team', image, finalObjectPosition, finalZoom);
        };
        let imgContent = '';
        if (image) {
            imgContent = `<img src="${image}" alt="" loading="lazy" style="object-position: ${finalObjectPosition}; --zoom: ${finalZoom}">`;
        }
        member.innerHTML = `
            <div class="people-photo">
               ${imgContent}
               <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="${image ? 'display:none' : ''}"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <div class="people-caption">
                <h3>${name}</h3>
                <span>${role}</span><span class="people-meet">Meet ${name.split(' ')[0]} ↗</span>
            </div>
        `;
        boardGrid.appendChild(member);
    }
    const peopleModal = document.getElementById('teamModal');
    peopleModal.setAttribute('role', 'dialog');
    peopleModal.setAttribute('aria-modal', 'true');
    peopleModal.setAttribute('aria-labelledby', 'modalName');
    function closePerson() {
        peopleModal.classList.remove('active');
        document.body.style.overflow = '';
        activePersonButton?.focus({ preventScroll: true });
    }
    document.querySelector('.modal-close').onclick = closePerson;
    document.querySelector('.modal-overlay').onclick = closePerson;
    document.addEventListener('keydown', event => {
        if (!peopleModal.classList.contains('active')) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            event.stopImmediatePropagation();
            closePerson();
        } else if (event.key === 'Tab') {
            event.preventDefault();
            document.querySelector('.modal-close').focus();
        }
    }, true);
});
