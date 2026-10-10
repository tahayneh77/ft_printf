/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main_test.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtahayne <mtahayne@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/10/08 14:40:00 by mtahayne          #+#    #+#             */
/*   Updated: 2026/10/08 14:40:00 by mtahayne         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "ft_printf.h"
#include <stdio.h>
#include <limits.h>

int	main(void)
{
	int	r1;
	int	r2;
	int	val;
	char *null_str;

	val = 42;
	null_str = NULL;
	printf("=== 42 FT_PRINTF COMPREHENSIVE TEST HARNESS ===\n\n");

	// 1. Character (%c)
	printf("[%%c Test]\n");
	r1 = ft_printf("ft_printf: [%c] [%c]\n", 'A', 'Z');
	r2 = printf("   printf: [%c] [%c]\n", 'A', 'Z');
	printf("Returns: ft = %d, orig = %d\n\n", r1, r2);

	// 2. String (%s)
	printf("[%%s Test]\n");
	r1 = ft_printf("ft_printf: [%s] [empty: %s] [null: %s]\n", "Hello 42", "", null_str);
	r2 = printf("   printf: [%s] [empty: %s] [null: %s]\n", "Hello 42", "", null_str);
	printf("Returns: ft = %d, orig = %d\n\n", r1, r2);

	// 3. Pointer (%p)
	printf("[%%p Test]\n");
	r1 = ft_printf("ft_printf: [%p] [null ptr: %p]\n", &val, NULL);
	r2 = printf("   printf: [%p] [null ptr: %p]\n", &val, NULL);
	printf("Returns: ft = %d, orig = %d\n\n", r1, r2);

	// 4. Decimal & Integer (%d, %i)
	printf("[%%d / %%i Test]\n");
	r1 = ft_printf("ft_printf: [%d] [%i] [min: %d] [max: %d]\n", 0, -42, INT_MIN, INT_MAX);
	r2 = printf("   printf: [%d] [%i] [min: %d] [max: %d]\n", 0, -42, INT_MIN, INT_MAX);
	printf("Returns: ft = %d, orig = %d\n\n", r1, r2);

	// 5. Unsigned (%u)
	printf("[%%u Test]\n");
	r1 = ft_printf("ft_printf: [%u] [max: %u]\n", 0, UINT_MAX);
	r2 = printf("   printf: [%u] [max: %u]\n", 0, UINT_MAX);
	printf("Returns: ft = %d, orig = %d\n\n", r1, r2);

	// 6. Hexadecimal (%x, %X)
	printf("[%%x / %%X Test]\n");
	r1 = ft_printf("ft_printf: [%x] [%X] [%x] [%X]\n", 0, 0, 3735928559U, 3735928559U);
	r2 = printf("   printf: [%x] [%X] [%x] [%X]\n", 0, 0, 3735928559U, 3735928559U);
	printf("Returns: ft = %d, orig = %d\n\n", r1, r2);

	// 7. Percent (%%)
	printf("[%%%% Test]\n");
	r1 = ft_printf("ft_printf: [%%%%] [100%%%% success]\n");
	r2 = printf("   printf: [%%%%] [100%%%% success]\n");
	printf("Returns: ft = %d, orig = %d\n\n", r1, r2);

	return (0);
}
