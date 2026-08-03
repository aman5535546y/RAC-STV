import zlib
import struct

def remove_black_bg(input_path, output_path):
    with open(input_path, 'rb') as f:
        data = f.read()

    # Verify PNG signature
    if data[:8] != b'\x89PNG\r\n\x1a\n':
        raise ValueError("Not a PNG file")

    pos = 8
    width = height = 0
    idat_chunks = []
    
    while pos < len(data):
        length = struct.unpack('>I', data[pos:pos+4])[0]
        chunk_type = data[pos+4:pos+8]
        chunk_data = data[pos+8:pos+8+length]
        pos += 12 + length
        
        if chunk_type == b'IHDR':
            width, height, bit_depth, color_type, compression, filter_method, interlace = struct.unpack('>IIBBBBB', chunk_data)
            print(f"PNG Header: {width}x{height}, bit_depth={bit_depth}, color_type={color_type}")
        elif chunk_type == b'IDAT':
            idat_chunks.append(chunk_data)

    decompressed = zlib.decompress(b''.join(idat_chunks))
    
    bpp = 4 if color_type == 6 else 3
    stride = 1 + width * bpp
    
    new_raw = bytearray()
    for y in range(height):
        line_start = y * stride
        filter_byte = decompressed[line_start]
        new_raw.append(filter_byte) # line filter method
        
        for x in range(width):
            px_idx = line_start + 1 + x * bpp
            if bpp == 4:
                r, g, b, a = decompressed[px_idx:px_idx+4]
            else:
                r, g, b = decompressed[px_idx:px_idx+3]
                a = 255
            
            # Make dark black background transparent
            if r < 40 and g < 40 and b < 40:
                r, g, b, a = 0, 0, 0, 0
            
            new_raw.extend([r, g, b, a])

    new_ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    
    def make_chunk(ctype, cdata):
        crc = zlib.crc32(ctype + cdata) & 0xffffffff
        return struct.pack('>I', len(cdata)) + ctype + cdata + struct.pack('>I', crc)

    compressed = zlib.compress(bytes(new_raw))
    
    png_out = b'\x89PNG\r\n\x1a\n'
    png_out += make_chunk(b'IHDR', new_ihdr)
    png_out += make_chunk(b'IDAT', compressed)
    png_out += make_chunk(b'IEND', b'')

    with open(output_path, 'wb') as f:
        f.write(png_out)
    print("Saved transparent PNG to", output_path)

remove_black_bg('public/assets/output-onlinepngtools(2).png', 'public/assets/output-onlinepngtools(2).png')
remove_black_bg('public/output-onlinepngtools(2).png', 'public/output-onlinepngtools(2).png')
