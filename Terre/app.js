const container = document.body
var LogClickBoolean = false;

//Scene & Camera & controls
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const controls = new THREE.OrbitControls( camera );
controls.autoRotateSpeed = 0.15;
controls.enableZoom = true;
setTimeout(() => {
    controls.autoRotate = true
}, 5000)

camera.position.z = 10;

//Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild( renderer.domElement );

var EarthTexture = new THREE.TextureLoader().load('earth.jpg')
var Material1 = new THREE.MeshBasicMaterial( {map: EarthTexture} );

var MarsTexture = new THREE.TextureLoader().load('mars.png')
var Material2= new THREE.MeshBasicMaterial( {map: MarsTexture} );

EarthTextureSelected = true;
//Sphere & texture
const Sphere1Geometry = new THREE.SphereGeometry( 5, 32, 32 );
var Earth = new THREE.Mesh( Sphere1Geometry, Material1 );
Earth.name = "earth"
scene.add( Earth );

/*function mousemove(e){
    let mouse = new THREE.Vector2(
        ( e.clientX / window.innerWidth ) * 2 - 1,
        - ( e.clientY / window.innerHeight ) * 2 + 1
    )
    RayCaster.setFromCamera(mouse, camera)
    let intersects = RayCaster.intersectObjects(scene.children)
    let foundSprite = false
    intersects.forEach(intersect => {
        let p = intersect.object.position.clone().project(camera)
        if(intersect.object.name === "France"){
            France.style.top = ((-1 * p.y + 1) * window.innerHeight / 2 ) + 'px'
            France.style.left = ((p.x +1) * window.innerWidth / 2 ) + 'px'
            France.classList.add('is-active')
            FranceActive = true
            foundSprite = true
        }
    });
    if(foundSprite === false && FranceActive){
        France.classList.remove('is-active')
    }
}
container.addEventListener('mousemove', mousemove)*/

//Animate
function animate() {
    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );
}
animate();

//Resize
function Resize () {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
}
window.addEventListener('resize', Resize)

/////////////////////////////
//    DEVELOPPER MODE      //
/////////////////////////////
if(window.location.search === "?developper=true"){
    document.querySelector('.developper').style.visibility = "visible";
    developper = true;
} else {developper = false;}
function LogPosition(){
    console.log("--Log Position--")
    console.log("x : " + camera.position.x)
    console.log("y : " + camera.position.y)
    console.log("z : " + camera.position.z)
    console.log("----------------")
}
function LogClick(){
    if(LogClickBoolean === true){
        LogClickBoolean = false;
        console.log('Log Click disabled')
    } else {
        LogClickBoolean = true;
        console.log('Log Click enabled')
    }
}

/////////////////////////////
//   CREATING THE TOOLTIPS  /
/////////////////////////////

//Tooltip Find Fuction
function FindToolTipByName(Name){
    for(var index in ListTooltip){
        if(ListTooltip[index].name === Name){
            return ListTooltip[index]
        }
    }
}

//Click
const RayCaster = new THREE.Raycaster()
function click(e){
    let mouse = new THREE.Vector2(
        ( e.clientX / window.innerWidth ) * 2 - 1,
        - ( e.clientY / window.innerHeight ) * 2 + 1
    )
    RayCaster.setFromCamera(mouse, camera)
    let intersects = RayCaster.intersectObjects( scene.children );
    intersects.forEach(intersect => {
        if(intersect.object.name === "earth"){if(LogClickBoolean){
            console.log('---Nouveau click---')
            console.log('x : ' + intersect.point.x)
            console.log('y : ' + intersect.point.y)
            console.log('z : ' + intersect.point.z)
            console.log(intersect.point.x + ", " + intersect.point.y + ", " + intersect.point.z)
            console.log('-------------------')
        }} else {
            FindToolTipByName(intersect.object.name).Click()
        }
    });
    controls.autoRotate = false
    setTimeout(function(){
            controls.autoRotate = true;
    }, 5000);
}
container.addEventListener('click', click)

//MouseOver
function MouseMove(e){
    let mouse = new THREE.Vector2(
        ( e.clientX / window.innerWidth ) * 2 - 1,
        - ( e.clientY / window.innerHeight ) * 2 + 1
    )
    RayCaster.setFromCamera(mouse, camera)
    let intersects = RayCaster.intersectObjects( scene.children );
    intersects.forEach(intersect => {
        if(intersect.object.name !== "earth"){
            //FindToolTipByName(intersect.object.name).Hide()
        }
    });
}
container.addEventListener('mousemove', MouseMove)

//HideTooltip
function HideTooltip(ActualTooltip){
    for(var index in ListTooltip){
        if(ActualTooltip !== ListTooltip[index]){
            ListTooltip[index].Hide()
        }
    }
}

//StopMusic
function StopMusic(){
    for(var index in ListTooltip){
        ListTooltip[index].Stop()
    }
}

//InitTooltip
function InitToolTip(AutomaticHideTooltip){
    for(var index in ListTooltip){
        scene.add(ListTooltip[index])
        document.getElementById('button').innerHTML = document.getElementById('button').innerHTML + '<a href="javascript:FindToolTipByName(' + "'" + ListTooltip[index].name + "'" + ').CameraGo()"><div class="individualbutton"><b>' + ListTooltip[index].name + '</b></div></a><br>'
    }
    if(AutomaticHideTooltip){
        HideTooltip()
    }
}

var Banner = document.getElementById('MusicInfo')

//Tooltip
function ToolTip( x, y, z, name, diameter, material, Ratio, html){
    let NewSphereGeometry = new THREE.SphereGeometry( diameter, 15, 15 );
    let NewMaterial = new THREE.MeshBasicMaterial( material );
    let NewTooltip = new THREE.Mesh( NewSphereGeometry, NewMaterial );
    NewTooltip.position.x = x
    NewTooltip.position.y = y
    NewTooltip.position.z = z
    NewTooltip.AudioPlayer = new Audio('Music/' + name + ".mp3")
    NewTooltip.name = name
    NewTooltip.playing = false
    NewTooltip.CameraGo = function(){
        NewTooltip.Click()
    }
    NewTooltip.Hide = function(){
        NewTooltip.showed = false
        NewMaterial.color.r = 0
        NewMaterial.color.g = 0
        NewMaterial.color.b = 0
        NewTooltip.Stop()
        NewTooltip.playing = false
        Banner.classList.remove('visible')
        Banner.classList.add('hidden')
    }
    NewTooltip.Show = function(){
        HideTooltip(NewTooltip)
        NewTooltip.showed = true
        NewMaterial.color.r = 255
        NewMaterial.color.g = 255
        NewMaterial.color.b = 0
        Banner.classList.remove('hidden')
        Banner.classList.add('visible')
        Banner.innerHTML = NewTooltip.bannertext
        if(EarthTextureSelected === false){
            Earth.material = Material1
            EarthTextureSelected = true
        }
    }
    NewTooltip.Click = function(){
        camera.position.x = x * Ratio
        camera.position.y = y * Ratio
        camera.position.z = z * Ratio
        NewTooltip.Show()
        for(var index in ListTooltip){if(ListTooltip[index] !== NewTooltip){ListTooltip[index].Stop()}}
        if(NewTooltip.playing){NewTooltip.Hide()} else {NewTooltip.AudioPlayer.play(); NewTooltip.playing = true}
    }
    NewTooltip.Stop = function(){
        NewTooltip.AudioPlayer.pause()
        NewTooltip.AudioPlayer.currentTime = 0
        NewTooltip.playing = false
    }
    NewTooltip.bannertext = html
    ListTooltip[name] = NewTooltip
    NewTooltip.AudioPlayer.addEventListener("ended", () => {NewTooltip.Hide()});
    return NewTooltip;
}


//MarsTooltip
function MarsToolTip( x, y, z, name, diameter, material, Ratio, html){
    let NewSphereGeometry = new THREE.SphereGeometry( diameter, 15, 15 );
    let NewMaterial = new THREE.MeshBasicMaterial( material );
    let NewTooltip = new THREE.Mesh( NewSphereGeometry, NewMaterial );
    NewTooltip.position.x = x
    NewTooltip.position.y = y
    NewTooltip.position.z = z
    NewTooltip.AudioPlayer = new Audio('Music/' + name + ".mp3")
    NewTooltip.name = name
    NewTooltip.playing = false
    NewTooltip.CameraGo = function(){
        NewTooltip.Click()
    }
    NewTooltip.Hide = function(){
        NewTooltip.showed = false
        NewMaterial.color.r = 0
        NewMaterial.color.g = 0
        NewMaterial.color.b = 0
        NewTooltip.Stop()
        NewTooltip.playing = false
        Banner.classList.remove('visible')
        Banner.classList.add('hidden')
    }
    NewTooltip.Show = function(){
        HideTooltip(NewTooltip)
        NewTooltip.showed = true
        NewMaterial.color.r = 255
        NewMaterial.color.g = 255
        NewMaterial.color.b = 0
        Banner.classList.remove('hidden')
        Banner.classList.add('visible')
        Banner.innerHTML = NewTooltip.bannertext
        if(EarthTextureSelected === true){
            Earth.material = Material2
            EarthTextureSelected = false
        }
    }
    NewTooltip.Click = function(){
        camera.position.x = x * Ratio
        camera.position.y = y * Ratio
        camera.position.z = z * Ratio
        NewTooltip.Show()
        for(var index in ListTooltip){if(ListTooltip[index] !== NewTooltip){ListTooltip[index].Stop()}}
        if(NewTooltip.playing){NewTooltip.Hide()} else {NewTooltip.AudioPlayer.play(); NewTooltip.playing = true}
    }
    NewTooltip.Stop = function(){
        NewTooltip.AudioPlayer.pause()
        NewTooltip.AudioPlayer.currentTime = 0
        NewTooltip.playing = false
    }
    NewTooltip.bannertext = html
    ListTooltip[name] = NewTooltip
    NewTooltip.AudioPlayer.addEventListener("ended", () => {NewTooltip.Hide()});
    return NewTooltip;
}

var ListTooltip = new Object;
new ToolTip(-0.5674585275632551, 1.5273430433636614, 4.701647375944815, "Mexique", 0.05, {color: 0xffff00, visible: true}, 1.5, "<h1><b>El Cascabel &#40;Sondes Voyager 1 et 2, 1977, Mexique&#41;</b></h1> &#171; J&#39;avais une clochette, avec un ruban violet 	&#187;. Les paroles de cette chanson mexicaine font penser à une chanson d&#39;amour, mais le sentiment qu&#39;elle évoque est tellement joyeux que les enfants de l&#39;école Pierre-Philippeaux l&#39;utilisent pour commencer cette partie consacrée à la vie scolaire.")
new ToolTip(4.8998432185560405, 0.4002608407186502, -0.8172598238070166, "Cameroun", 0.05, {color: 0xffff00, visible: true}, 1.5, "<h1><b>Amina (2019, Le Mans)</b></h1>Cette chanson est connue avec des variations dans de nombreux pays africains. Le sens des paroles en est assez obscur, mais cela importe peu car c&#39;est surtout le jeu de mains qui compte. Elle sera présentée en refrain, en alternance avec d&#39;autres chansons de récréations proposées par les élèves.")
new ToolTip(3.430303931051456, 3.6177928715768264, -0.14692811752842871, "France", 0.05, {color: 0xffff00, visible: true}, 1.5, "<h1><b>Clown , 2014, Soprano</b></h1>Le ton de cette chanson est volontairement trompeur : le refrain entraînant semble joyeux, mais le chanteur Soprano montre au contraire que cette liesse n&#39;est qu&#39;une façade, et qu&#39;il n&#39;est pas toujours facile de monter sur une scène lorsqu&#39;on est triste.")
new ToolTip(2.504005255005414, 3.2519016907040017, -2.8276674267376634, "Azerbaïdjan", 0.05, {color: 0xffff00, visible: true}, 1.5, "<h1><b>Mélodie d&#39;Azerbaïdjan (Sondes Voyager 1 et 2, 1977)</h1></b>")
new ToolTip(2.590847419126813, 4.009249592969172, -1.4388681750618246, "Russie", 0.05, {color: 0xffff00, visible: true}, 1.5, "<h1><b>Le Sacre du Printemps</b></h1><br>Igor Stravinsky (Sondes Voyager 1 et 2, 1977, France-Russie)<br>La sonde spatiale emportait en 1977 un extrait de ce ballet du musicien russe, donné pour la première fois à Paris en 1913. Les musiciens manceaux reprennent les Augure printaniers, transformés en manifestation d'inquiétude sur le devenir de notre planète.")
new ToolTip(2.4148358093674043, 4.300549781525742, -0.743595031080555, "Suède", 0.05, {color: 0xffff00, visible: true}, 1.5, "<h1><b>The winner takes it all, Mamma Mia, Dancing Queen</b></h1><br>Abba (1980, 1975, 1976, Suède)<br>Pour finir brillamment ce spectacle , voici trois « tubes » du légendaire groupe suédois, venus tout droit des années « pop ». ")
new ToolTip(4.027021858188622, 2.947149957097634, -0.04838640732130306, "Algérie", 0.05, {color: 0xffff00, visible: true}, 1.5, "<h1><b>Zina,  Babylone (2011, Algérie)</b></h1><br>La musique est souvent utilisée pour évoquer les sentiments amoureux, la joie de voir son/sa bien-aimé(e) ou l'inquiétude de ne pas lui plaire. « Hé Zina ! Qu'est-ce que tu nous as fait ? Mon cœur et moi t'avons cherchée. Nous ne t'avons pas trouvée. »<br>Voilà les mots de cette chanson toute simple et tendre du groupe algérien Babylone.")
new MarsToolTip(-0.5060489490949647, 4.972946327615634, 0.04170403951955581, "Mars", 0.05, {color: 0xffff00, visible: true}, 1.5, '<div class="Lomtrian">Heureux qui, comme Ulysse, a fait un beau voyage,<br>Ou comme cestui-là qui conquit la toison,<br>Et puis est retourné, plein d’usage et raison,<br>Vivre entre ses parents le reste de son âge !<br><br>Quand reverrai-je, hélas ! de mon petit village<br>Fumer la cheminée, et en quelle saison<br>Reverrai-je le clos de ma pauvre maison,<br>Qui m’est une province, et beaucoup davantage ?  </div>')
InitToolTip(true)

//    