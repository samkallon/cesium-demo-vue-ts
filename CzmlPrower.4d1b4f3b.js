import{d as E,u as L,o as O,c as P,e as f,m as g,_ as I}from"./index.2ad12903.js";import{C as h}from"./cesiumUtils.efa84583.js";const D="/cesiumdemo/model/tesla_model_s_plaid_2021/scene.gltf",k="/cesiumdemo/model/stylized_ww1_plane/scene.gltf",s=window.Cesium,A=window.viewer;new h({viewer:A});let a=new Date("2018-07-19T15:18:00Z"),l="",m=[{id:"document",version:"1.0",clock:{interval:"2018-07-19T15:18:00Z/2018-07-19T16:15:30.000Z",currentTime:"2018-07-19T15:18:00Z",multiplier:3,range:"LOOP_STOP",step:"SYSTEM_CLOCK_MULTIPLIER"}},{id:"car1",model:{gltf:D,scale:.01,minimumPixelSize:20,maximumScale:2e5},position:{interpolationAlgorithm:"LINEAR",forwardExtrapolationType:"HOLD",cartesian:[]}}],d=[{id:"document",version:"1.0",clock:{interval:"2018-07-19T15:18:00Z/2018-07-19T16:15:30.000Z",currentTime:"2018-07-19T15:18:00Z",multiplier:1,range:"LOOP_STOP",step:"SYSTEM_CLOCK_MULTIPLIER"}},{id:"plane1",model:{gltf:k,scale:10,minimumPixelSize:20,maximumScale:2e5},position:{interpolationAlgorithm:"LINEAR",forwardExtrapolationType:"HOLD",cartesian:[]}}],_=[{x:-4.1311058979556584e6,y:2896972147818016e-9,z:-3.8885200161803425e6},{x:-4.1310939502710938e6,y:2.8969456670999224e6,z:-3.8885508364567226e6},{x:-4.1310772392028887e6,y:2896911921756028e-9,z:-3.8885918179781204e6},{x:-4.1310644066149443e6,y:2896883726746967e-9,z:-3.8886251986805475e6},{x:-4.1310538916155957e6,y:2896859375485572e-9,z:-3888653151189188e-9},{x:-4131043766634174e-9,y:2.8968399685390713e6,z:-3.8886774184339745e6},{x:-4.1310370202958747e6,y:2896820892194283e-9,z:-3.8886983546075467e6},{x:-4.1310281255717836e6,y:2.8968013209844413e6,z:-3.8887213961878777e6},{x:-4.1310197756690136e6,y:2896781596834817e-9,z:-3.8887441857895516e6},{x:-4131012808602331e-9,y:2.8967652926836996e6,z:-3.8887631078915396e6},{x:-4.1310071228419426e6,y:2.8967503495997996e6,z:-3.8887796750039584e6},{x:-4131000341242157e-9,y:2.8967353449919443e6,z:-3888797453194022e-9},{x:-4.1309920694623417e6,y:2896716174303597e-9,z:-3.8888198355821036e6},{x:-4.1309842023936417e6,y:2896699824218247e-9,z:-3.8888396608074983e6},{x:-4130975019510206e-9,y:2.8966758394944207e6,z:-3.8888659377992162e6},{x:-4.1309663657628326e6,y:2896658234494335e-9,z:-3.8888875818992625e6},{x:-413095761496035e-8,y:2.8966398072196753e6,z:-3.8889099017088288e6},{x:-4.1309547071104576e6,y:289662962349208e-8,z:-3.8889204466807167e6},{x:-4130946014861496e-9,y:289663489894735e-8,z:-3888925865188674e-9},{x:-4130927758681611e-9,y:2896652504279255e-9,z:-3.8889332445758916e6},{x:-4.1309041776992083e6,y:2896674437463431e-9,z:-3.8889430430677314e6},{x:-4.1308887330500246e6,y:2896688506832972e-9,z:-3888950299814738e-9},{x:-4130870309231004e-9,y:2.8967068228194155e6,z:-3.8889614174866704e6},{x:-4.1308528399184607e6,y:2.8967225404158235e6,z:-3.8889669645554973e6},{x:-4130835341436233e-9,y:2896742076088869e-9,z:-3888973047181404e-9},{x:-4130816307488155e-9,y:2896761406738008e-9,z:-3.8889814652621853e6},{x:-4130798848967062e-9,y:2896777524171944e-9,z:-3.8889896501373695e6},{x:-4.1307924900816036e6,y:2.8967820226855236e6,z:-3888993454888194e-9},{x:-4130793241563739e-9,y:2896770469148109e-9,z:-3.8890008587071747e6},{x:-4130788901832338e-9,y:2.8967639329142394e6,z:-3889010445078096e-9},{x:-4130785027181908e-9,y:2896755446955243e-9,z:-3889021439554563e-9},{x:-4130779336379377e-9,y:2.8967417187632187e6,z:-3889037565050388e-9},{x:-4.1307709007907007e6,y:2896726365614736e-9,z:-3.8890585569218006e6},{x:-4.1307584589221557e6,y:2.8967129563575755e6,z:-3889081868051833e-9},{x:-4.1307373093386176e6,y:289672722670923e-8,z:-3.8890953604534585e6},{x:-4.1307219393201307e6,y:2.8967424240874173e6,z:-3.8891016069862694e6},{x:-4.1307099396591336e6,y:2.8967544691434177e6,z:-3889106661882335e-9},{x:-4.1306948666388923e6,y:2.8967694476528233e6,z:-3889113264036144e-9},{x:-4130674354952316e-9,y:2896787618136564e-9,z:-3.8891229598553358e6},{x:-4130661390269054e-9,y:2896801038209172e-9,z:-3889127442419631e-9},{x:-4130649653144622e-9,y:2.8968123923858535e6,z:-3.8891319311322323e6},{x:-4130629899683216e-9,y:2.8968306365539907e6,z:-3889139405993112e-9},{x:-4.1306068915663105e6,y:2.8968492963244454e6,z:-3889148571939132e-9},{x:-4130596686706369e-9,y:2.8968460496168793e6,z:-3889161246057459e-9},{x:-4130588317029964e-9,y:2.8968287710903944e6,z:-3889182720500731e-9},{x:-4.1305794082372217e6,y:2896810748062973e-9,z:-3.8892049873221754e6},{x:-4.1305715477545494e6,y:2896788626823927e-9,z:-3889229029787593e-9},{x:-4.1305604860948687e6,y:2.8967664644296276e6,z:-3.8892565481403954e6},{x:-4130550185035939e-9,y:2896742941557488e-9,z:-3889283461948039e-9},{x:-4.1305402386010643e6,y:2896719048466863e-9,z:-3.8893102019187245e6},{x:-4130526952520206e-9,y:2896693546327754e-9,z:-388934116528171e-8},{x:-4130516377254174e-9,y:2.8966695928749004e6,z:-3.8893681838014508e6},{x:-4130504057493225e-9,y:2.8966421985703353e6,z:-3.8893991793009173e6},{x:-4.1304916783072394e6,y:2896614221501441e-9,z:-3.8894302246104004e6},{x:-4.1304796712551536e6,y:2.8965893694463405e6,z:-3889458028394572e-9},{x:-4.1304686390428743e6,y:2.8965647197136125e6,z:-388948547337427e-8},{x:-4.1304608690307518e6,y:2.8965466695616627e6,z:-388950478162498e-8},{x:-4.1304512319910517e6,y:2896527226136305e-9,z:-3.8895261875367924e6},{x:-4130439405718207e-9,y:2.8965020362911364e6,z:-388955300118654e-8},{x:-4130439995260722e-9,y:2.8964926622365094e6,z:-3.8895585429235585e6},{x:-4130451007753617e-9,y:2896478279303268e-9,z:-3.8895571581223044e6},{x:-4.1304656504183854e6,y:2896466084602302e-9,z:-388955105802869e-8},{x:-4.1304972915169527e6,y:2.8964350210336926e6,z:-3889540945169918e-9},{x:-4130500510973461e-9,y:2.8964162028782465e6,z:-3.8895497261737883e6},{x:-4130490796137669e-9,y:2896395911070586e-9,z:-3.8895716666667676e6},{x:-4130478494684034e-9,y:2896375865137916e-9,z:-3889595986155435e-9},{x:-4130469361358232e-9,y:2.8963513508613957e6,z:-3.8896218591105537e6},{x:-4130459653127115e-9,y:2896326427110166e-9,z:-3889651075625755e-9},{x:-4130454746097315e-9,y:2.8963121481351727e6,z:-3889667085808963e-9},{x:-4130438648413533e-9,y:2.8962951234368607e6,z:-3.8896986025950382e6},{x:-4.1304063667247174e6,y:2896269579059276e-9,z:-3.8897511814646446e6},{x:-4130380665153025e-9,y:2.8962434919846198e6,z:-3.8897947848271434e6},{x:-4.1303506645746655e6,y:2.8962330531032314e6,z:-388983359891804e-8},{x:-4.1303133547596666e6,y:2.8962294539732332e6,z:-3.8898748104849476e6},{x:-4130280475713839e-9,y:2.8962234705034187e6,z:-3.8899138601564257e6},{x:-4.1302508929914734e6,y:2.8962172586377915e6,z:-388995023878484e-8},{x:-4130247454952308e-9,y:2896210438373141e-9,z:-3889958676345645e-9},{x:-4.1302513910230068e6,y:2.8961991892860155e6,z:-3889962851278869e-9},{x:-413026421147237e-8,y:289617917898423e-8,z:-3889964722162547e-9},{x:-4.1302781511079515e6,y:2896150278896323e-9,z:-3.8899722202774487e6},{x:-4.1302900078189876e6,y:2896116123713046e-9,z:-3889985113922655e-9},{x:-413029632985568e-8,y:2896087606223302e-9,z:-3.8899989771753442e6},{x:-4.1303080029669553e6,y:2.8960410364240548e6,z:-3890021162711144e-9},{x:-4.1303103504519076e6,y:2896004721693241e-9,z:-3890045613767786e-9},{x:-4.1303135911898166e6,y:2.8959600510454215e6,z:-3890074820752629e-9},{x:-4.1303192208124264e6,y:2895916945646996e-9,z:-3890100967641694e-9},{x:-4.1303220305786557e6,y:2.8958895287982468e6,z:-3.8901185463933204e6},{x:-4.1303242122931913e6,y:2.8958536152825514e6,z:-3.8901431636700407e6},{x:-4130323940029688e-9,y:2.8958272762474557e6,z:-3.8901632230245867e6},{x:-4.1303225869613704e6,y:2.8958053034565207e6,z:-3890181844234483e-9},{x:-4.1303202465283596e6,y:289578202679685e-8,z:-3890202579822223e-9},{x:-4130313315250443e-9,y:2.8957562142744963e6,z:-3.8902299644577354e6},{x:-4130305353215634e-9,y:2.8957354521534303e6,z:-3890253499528326e-9},{x:-4.1302980309572276e6,y:2895726856537849e-9,z:-3.8902673295285385e6},{x:-4130295522604649e-9,y:2.8957281153681995e6,z:-3.8902685999895027e6},{x:-4130289110382134e-9,y:2895730888726017e-9,z:-3.8902726545348084e6},{x:-4.1302753698197827e6,y:2.8957412996942033e6,z:-3890277893700179e-9},{x:-4.1302508108436163e6,y:2895763266553474e-9,z:-3890284894019503e-9},{x:-4130233325062017e-9,y:2895781513139067e-9,z:-3.8902899837837974e6},{x:-4.1302069416348725e6,y:2.8958112476860075e6,z:-389029818874633e-8},{x:-4130175780086002e-9,y:2895843155194485e-9,z:-3890309961980824e-9},{x:-4.1301346094147004e6,y:2895884126407479e-9,z:-3890326869685404e-9},{x:-4.1300927033699444e6,y:2.8959234473912762e6,z:-3.8903460186137664e6},{x:-4130053357090442e-9,y:2895959286943558e-9,z:-3890363570454215e-9},{x:-4130005213682317e-9,y:2896003591500705e-9,z:-3.8903843858761196e6},{x:-4129950512575626e-9,y:2.8960562835726785e6,z:-3.8904050234604524e6},{x:-4129904552129884e-9,y:2896105032988806e-9,z:-3890418553203597e-9},{x:-4129847398752529e-9,y:2896172333826749e-9,z:-3890428953214162e-9},{x:-4129807639512054e-9,y:2896226402365734e-9,z:-3.8904316554187066e6},{x:-4.1297701640198547e6,y:2896284182743338e-9,z:-3890428854372436e-9},{x:-4129736186181204e-9,y:2.8963450574883292e6,z:-3890420296130725e-9},{x:-412969902381569e-8,y:2896417820942145e-9,z:-3.8904050734028514e6},{x:-412965010022805e-8,y:2.8965195686702803e6,z:-3.8903806207021405e6},{x:-4129614901556453e-9,y:2.8965912958960435e6,z:-3.8903640580830765e6},{x:-4129594596801298e-9,y:2.8966299238896086e6,z:-3.8903561724144183e6},{x:-4.1295712246569833e6,y:2.8966722322960696e6,z:-3.8903493060966455e6},{x:-4.1295458333211015e6,y:2.8967191497513945e6,z:-389034040087913e-8},{x:-4.1295173257705756e6,y:2.8967709997991635e6,z:-3890331205243247e-9},{x:-4129481127515623e-9,y:2896837441714896e-9,z:-3.8903182233583136e6},{x:-4.1294447284175917e6,y:2.8968992285369113e6,z:-3.8903062347816424e6},{x:-4.1294093098941403e6,y:2.8969598973833458e6,z:-3.8902934186437656e6},{x:-4129394190498092e-9,y:2.8969877568044495e6,z:-3890287069010821e-9},{x:-4.1293849302999317e6,y:2.8970099391555837e6,z:-3.8902789472340187e6},{x:-4.1293809025741206e6,y:2.8970345151175754e6,z:-3.8902629699092503e6},{x:-4129395380126628e-9,y:2897062850016253e-9,z:-3.8902272323757173e6},{x:-4129419299310805e-9,y:2897061276312659e-9,z:-3890203012824626e-9},{x:-4.1294568252164796e6,y:2.8970563369560763e6,z:-3890166445547454e-9},{x:-4.1294940920051397e6,y:2.8970593228078503e6,z:-3890125374867398e-9},{x:-4.1295332503057914e6,y:2897083785943948e-9,z:-389006857109727e-8},{x:-4129567132574767e-9,y:2897129037436901e-9,z:-3.8900051538674505e6},{x:-4.1295895898529505e6,y:2.8971342528188485e6,z:-3889977603789211e-9},{x:-4.1296165234048055e6,y:2897129188843633e-9,z:-3.8899511590686254e6},{x:-4.1296433667616905e6,y:2.8971138436645414e6,z:-3.8899317628938416e6},{x:-4.1296693040294438e6,y:2.8970860321238614e6,z:-3.8899219946198207e6},{x:-4129703822319816e-9,y:2.8970544516091463e6,z:-3.8899090768787833e6},{x:-4.1297284315924137e6,y:2897035171185982e-9,z:-3.8898955654060966e6},{x:-4.1297352854577852e6,y:2.8970369881081325e6,z:-3889887175702072e-9},{x:-4.1297402001161454e6,y:2897051121995583e-9,z:-3889872223547175e-9},{x:-412974766565467e-8,y:2.8970843611419164e6,z:-3.8898395886546266e6}],S=[{x:-4131308382387428e-9,y:2895872101504785e-9,z:-3889162520375158e-9},{x:-4131027687853612e-9,y:2896742703867785e-9,z:-3888779186959942e-9},{x:-413059060300973e-8,y:2895922812243236e-9,z:-3.8898127469981275e6},{x:-4.1300010261121006e6,y:2896186273694514e-9,z:-3.8902353923596283e6},{x:-4.1304522182880356e6,y:2.8969052661027918e6,z:-3889279731102912e-9}];_.forEach((z,t)=>{let y;t>80&&(y=new Date(a.getTime()+(t-81)*5*1e3),m[1].position.cartesian.push(y.toISOString(),z.x,z.y,z.z)),t===_.length-1&&y&&(l=y.toISOString(),m[0].clock.interval=a.toISOString()+"/"+l)});S.map(z=>{let t=s.Cartographic.fromCartesian(z);return s.Cartesian3.fromDegrees(s.Math.toDegrees(t.longitude),s.Math.toDegrees(t.latitude),100)}).forEach((z,t)=>{let y=new Date(a.getTime()+t*10*1e3);d[1].position.cartesian.push(y.toISOString(),z.x,z.y,z.z),t===S.length-1&&y&&(l=y.toISOString(),d[0].clock.interval=a.toISOString()+"/"+l)});const C={czmlCar:m,czmlPlane:d},Z={class:"czml-container"},n=window.Cesium,M=E({__name:"CzmlPrower",setup(z,{expose:t}){const e=L().$state.cesiumViewer;let u,r;const p=x=>{w(),g.info("\u6570\u636E\u52A0\u8F7D\u4E2D!"),e&&(window.tileset69380=e.scene.primitives.add(new n.Cesium3DTileset({url:n.IonResource.fromAssetId(69380)})),e.scene.light=new n.DirectionalLight({direction:new n.Cartesian3(.35492591601301104,-.8909182691839401,-.2833588392420772)}),e.zoomTo(window.tileset69380),v(x==="car1"?C.czmlCar:C.czmlPlane,x),window.tileset69380.initialTilesLoaded.addEventListener(T))},T=()=>{if(g.info("\u6570\u636E\u52A0\u8F7D\u5B8C\u6210!"),!e)return;e.clock.shouldAnimate=!0;const x=[r];e.scene.postRender.addEventListener(function(){var i=u.getValue(e.clock.currentTime);r.position=e.scene.clampToHeight(i,x)})},v=(x,i)=>{!e||(r=e.dataSources.add(n.CzmlDataSource.load(x)).then(function(c){let o=c.entities.getById(i);o&&(e.zoomTo(o),e.trackedEntity=o,u=o.position,o.orientation=new n.VelocityOrientationProperty(o.position))}))},w=()=>{!e||!r||(e.trackedEntity=void 0,e.dataSources.remove(r),e.scene.primitives.remove(window.tileset69380),window.tileset69380=null)};return t({clear:w}),(x,i)=>(O(),P("div",Z,[f("fc-arrow-btn",{left:"",onClick:i[0]||(i[0]=c=>p("plane1"))},"\u98DE\u673A"),f("fc-arrow-btn",{right:"",onClick:i[1]||(i[1]=c=>p("car1"))},"\u5C0F\u8F66")]))}});const b=I(M,[["__scopeId","data-v-45d799e1"]]);export{b as default};
