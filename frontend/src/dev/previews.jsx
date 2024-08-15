import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import {Welcome} from "../components/auth/Welcome.jsx";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/Welcome">
                <Welcome/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews