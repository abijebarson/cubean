import { Pane } from 'tweakpane';

export function initGui(cubes) {
    const pane = new Pane({ title: 'Cube Controls' });
    
    const PARAMS = {
        allColored: true,
        allGrey: () => {
            PARAMS.allColored = false;
            updateAll(false);
        },
        reset: () => {
            PARAMS.allColored = true;
            updateAll(true);
        }
    };

    cubes.forEach((c, i) => {
        PARAMS[`cube_${i}`] = true;
    });

    function updateAll(state) {
        cubes.forEach((c, i) => {
            PARAMS[`cube_${i}`] = state;
            c.toggleColor(state);
        });
        pane.refresh();
    }

    const fGlobal = pane.addFolder({ title: 'Global Actions' });
    fGlobal.addButton({ title: 'Set All Grey' }).on('click', PARAMS.allGrey);
    fGlobal.addButton({ title: 'Set All Colored' }).on('click', PARAMS.reset);

    const folderTop = pane.addFolder({ title: 'Top Layer (Y=1)', expanded: false });
    const folderMiddle = pane.addFolder({ title: 'Middle Layer (Y=0)', expanded: false });
    const folderBottom = pane.addFolder({ title: 'Bottom Layer (Y=-1)', expanded: false });

    cubes.forEach((cube, i) => {        
        const yLayer = Math.floor(i / 3) % 3;
        let targetFolder;

        if (yLayer === 2) targetFolder = folderTop;
        else if (yLayer === 1) targetFolder = folderMiddle;
        else targetFolder = folderBottom;

        targetFolder.addBinding(PARAMS, `cube_${i}`, { label: `Cube ${i}` })
            .on('change', (ev) => {
                cube.toggleColor(ev.value);
            });
    });
}