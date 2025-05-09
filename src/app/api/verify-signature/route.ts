import { NextRequest, NextResponse } from 'next/server';
import { PublicKey } from '@solana/web3.js';
import * as nacl from 'tweetnacl';

export async function POST(request: NextRequest) {
  try {
    const { message, signature, publicKey } = await request.json();

    if (!message || !signature || !publicKey) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert signature from base64 to Uint8Array
    const signatureUint8 = new Uint8Array(
      signature.map((val: number) => val)
    );

    // Convert message to bytes
    const messageBytes = new TextEncoder().encode(message);

    // Create PublicKey instance
    const pubKey = new PublicKey(publicKey);

    // Verify the signature
    const isValid = nacl.sign.detached.verify(
      messageBytes,
      signatureUint8,
      pubKey.toBytes()
    );

    if (isValid) {
      return NextResponse.json({
        success: true,
        publicKey: publicKey,
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error verifying signature:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify signature' },
      { status: 500 }
    );
  }
}
