// check the onScroll event of the window

let showElements = () => {

    let scrollTop = window.pageYOffset // save the scroll top value
    let windowHeight = window.innerHeight // save the windows height
    let sections = Array.from(document.querySelectorAll('.animated-section')) // save the sections top offset value

    sections.forEach((section) => {

        let sectionOffsetTop = section.offsetTop

        if (scrollTop > sectionOffsetTop - (windowHeight / 1.3)) {

            section.childNodes.forEach((childNode) => {

                childNode.classList.add('animate')

            })

        }
    })

}

window.addEventListener('scroll', showElements);
