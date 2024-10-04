async function StartShowingPeriodic() {
  try {
    const fetched = await fetch("./data/periodic.json")
    const data = await fetched.json()
    console.log(data)
    const tableStructure = data.table_comp_elements.map(a => {
      const keysMap = a.map(nameelement => {
        if(!nameelement) return null
        if(!data.detail_info[nameelement]) return null
        const structureInfo = data.detail_info[nameelement]
        const propertiInfo = data.properties[structureInfo.properti.replace("properties.","")]
        let totalenergy = 0
        for(let i of structureInfo.energy_level) {
          totalenergy = totalenergy + Number(i)
        }
        console.log(nameelement, propertiInfo)
        return {
          id: nameelement,
          ...structureInfo,
          total_energy: totalenergy,
          color: propertiInfo.color,
          properti: propertiInfo
        }
      })
      return keysMap
    })
    const containerElement = document.querySelector('.table-periodic')
    for(let rowPerData of tableStructure) {
      const boxContain = document.createElement("div")
      boxContain.className = 'row-table'
      for(let shellData of rowPerData) {
        const shellContain = document.createElement("div")
        shellContain.className = "shell-table"
        if(typeof shellData == "object" && !!shellData) {
          shellContain.innerHTML = `<div class="boxin" style="background-color: ${shellData.color};"><span class="totalenergy">${shellData.total_energy}</span><h2>${shellData.symbol}</h2><small>${shellData.name}</small></div>`
          shellContain.addEventListener("click", () => {
            const panelBackdrop = document.querySelector('.info-panel-backdrop')
            const panelInfo = document.querySelector('.info-panel')
            // Animate Open
            panelBackdrop.style.display = "block"
            document.querySelector('.info-panel iframe').src = `https://id.wikipedia.org/wiki/${shellData.name}`
            setTimeout(() => {
              panelBackdrop.style.backdropFilter = "blur(5px)"
              panelBackdrop.style.opacity = "1"
              panelInfo.style.marginLeft = "0px"
            }, 50)
            function TargetClose() {
              panelBackdrop.style.backdropFilter = "blur(0px)"
              panelBackdrop.style.opacity = "0"
              panelInfo.style.marginLeft = "-400px"
              setTimeout(() => {
                document.querySelector('.info-panel iframe').src = ""
                panelBackdrop.style.display = "none"
              }, 300)
              panelBackdrop.removeEventListener("click", TargetClose)
            }
            panelBackdrop.addEventListener("click", TargetClose)
          })
        }
        boxContain.append(shellContain)
      }
      containerElement.append(boxContain)
    }
  } catch(err) {
    console.error(err.stack)
  }
}
StartShowingPeriodic()