//
// The algorithm
//

// Takes the Container's width/height (page, div, etc)
// and the Inner's width/height (image, canvas, etc)
// and returns the maximum size the Inner can be
// while still all visible.
function maxInnerSize( containerWidth, containerHeight, innerWidth, innerHeight ){
    const containerRatio = containerWidth / containerHeight;
    const innerRatio = innerWidth / innerHeight;
  
    // calculate output size
    if ( innerRatio > containerRatio ){
      // max width, relative height
      innerWidth = containerWidth;
      innerHeight = containerWidth / innerRatio;
    } else {
      // max height, relative width
      innerWidth = containerHeight * innerRatio;
      innerHeight = containerHeight;
    }
  
    return {
      width: Math.floor(innerWidth),
      height: Math.floor(innerHeight),
    };
  }
  
  //
  // The rest is usage or plumbing for the example
  //
  
  let pageWidth = window.innerWidth;
  let pageHeight = window.innerHeight;
  
  // With the current size data, figure out the maximum
  // size and "render" it by settings Inner's size and
  // position with CSS.
  function draw(){
    const { width, height } = maxInnerSize( pageWidth, pageHeight, f.width.valueAsNumber, f.height.valueAsNumber );
  
    // Display result
    i.style.width = width + "px";
    i.style.height = height + "px";
    i.textContent = `${width}x${height} (${f.width.value}x${f.height.value})`;
  
    // Position in the center
    i.style.top = (pageHeight - height) / 2 + "px";
    i.style.left = (pageWidth - width) / 2 + "px";
  }
  
  //
  // Plumbing for the example
  //
  
  // Draw on submit
  f.addEventListener("submit",function (ev){
    ev.preventDefault();
    draw();
  }, false);
  
  // Randomize button
  f.rand.addEventListener("click", function(){
    f.width.value = Math.floor(200 + Math.random() * 3000);
    f.height.value = Math.floor(200 + Math.random() * 3000);
    draw()
  }, false);
  
  // Update the cntainer size on window resize.
  // This probably should be debounced, but this
  // demo is relatively light weight.
  window.addEventListener("resize", function(){
    pageWidth = window.innerWidth;
    pageHeight = window.innerHeight;
    draw();
  }, false);
  
  draw();