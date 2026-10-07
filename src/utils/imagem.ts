import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export interface ImagemEscolhida {
  uri: string;
  buffer: ArrayBuffer;
  extensao: string;
}

const ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/** Decodifica base64 em ArrayBuffer (sem depender de atob/Buffer no React Native). */
function base64ParaArrayBuffer(base64: string): ArrayBuffer {
  const limpo = base64.replace(/[^A-Za-z0-9+/]/g, '');
  const tamanho = Math.floor((limpo.length * 3) / 4);
  const bytes = new Uint8Array(tamanho);

  let p = 0;
  for (let i = 0; i < limpo.length; i += 4) {
    const e1 = ALFABETO.indexOf(limpo[i]);
    const e2 = ALFABETO.indexOf(limpo[i + 1]);
    const e3 = i + 2 < limpo.length ? ALFABETO.indexOf(limpo[i + 2]) : -1;
    const e4 = i + 3 < limpo.length ? ALFABETO.indexOf(limpo[i + 3]) : -1;

    bytes[p++] = (e1 << 2) | (e2 >> 4);
    if (e3 !== -1) bytes[p++] = ((e2 & 15) << 4) | (e3 >> 2);
    if (e4 !== -1) bytes[p++] = ((e3 & 3) << 6) | e4;
  }

  return bytes.buffer.slice(0, p);
}

function extensaoDe(asset: ImagePicker.ImagePickerAsset): string {
  const mime = asset.mimeType?.split('/')[1];
  const doUri = asset.uri.split('.').pop()?.split('?')[0]?.toLowerCase();
  const ext = (mime || doUri || 'jpeg').toLowerCase();
  return ext === 'jpg' ? 'jpeg' : ext;
}

/**
 * Abre a galeria (ou a câmera) e devolve a imagem pronta para upload.
 * Retorna null se o usuário cancelar ou negar a permissão.
 */
export async function escolherImagem(
  origem: 'galeria' | 'camera' = 'galeria'
): Promise<ImagemEscolhida | null> {
  const permissao =
    origem === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissao.granted) {
    Alert.alert(
      'Permissão necessária',
      origem === 'camera'
        ? 'Permita o acesso à câmera para tirar a foto.'
        : 'Permita o acesso às fotos para escolher uma imagem.'
    );
    return null;
  }

  const opcoes: ImagePicker.ImagePickerOptions = {
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
    base64: true,
  };

  const resultado =
    origem === 'camera'
      ? await ImagePicker.launchCameraAsync(opcoes)
      : await ImagePicker.launchImageLibraryAsync(opcoes);

  if (resultado.canceled || !resultado.assets?.[0]) return null;

  const asset = resultado.assets[0];

  if (!asset.base64) {
    Alert.alert('Erro', 'Não foi possível ler a imagem selecionada.');
    return null;
  }

  return {
    uri: asset.uri,
    buffer: base64ParaArrayBuffer(asset.base64),
    extensao: extensaoDe(asset),
  };
}

/** Pergunta se a foto vem da galeria ou da câmera e devolve a imagem escolhida. */
export function escolherOrigemEImagem(): Promise<ImagemEscolhida | null> {
  return new Promise((resolve) => {
    Alert.alert('Alterar foto', 'De onde deseja escolher a foto?', [
      { text: 'Galeria', onPress: () => escolherImagem('galeria').then(resolve) },
      { text: 'Câmera', onPress: () => escolherImagem('camera').then(resolve) },
      { text: 'Cancelar', style: 'cancel', onPress: () => resolve(null) },
    ], { cancelable: true, onDismiss: () => resolve(null) });
  });
}
